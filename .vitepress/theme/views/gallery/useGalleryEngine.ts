import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { gsap } from "gsap";
import {
  AnimationEngine,
  Gallery,
  GridLayout,
  JustifiedLayout,
  MasonryLayout,
  PreviewEngine,
  Renderer,
  ZoomManager,
  createImageCache,
  registerBuiltInAnimationPresets,
} from "@gallery-engine/suite";
import type {
  GalleryImage,
  GsapAnimationAdapter,
  Layout,
  PreviewState,
  RenderItem,
  Unsubscribe,
  ZoomState,
} from "@gallery-engine/suite";

export type GalleryLayoutMode = "masonry" | "grid" | "justified";

const layoutModes: readonly GalleryLayoutMode[] = ["masonry", "grid", "justified"];
const gridLayoutAspect = {
  width: 4,
  height: 3,
} as const;

type GsapTarget = gsap.TweenTarget;
type GsapVars = gsap.TweenVars;

const gsapAdapter: GsapAnimationAdapter = {
  to: (target, vars) => gsap.to(target as GsapTarget, vars as unknown as GsapVars),
  from: (target, vars) => gsap.from(target as GsapTarget, vars as unknown as GsapVars),
  fromTo: (target, fromVars, toVars) =>
    gsap.fromTo(
      target as GsapTarget,
      fromVars as unknown as GsapVars,
      toVars as unknown as GsapVars
    ),
};

export const useGalleryEngine = (images: readonly GalleryImage[]) => {
  const containerRef = ref<HTMLElement | null>(null);
  const previewImageRef = ref<HTMLImageElement | null>(null);
  const previewFigureRef = ref<HTMLElement | null>(null);
  const layoutMode = ref<GalleryLayoutMode>("masonry");
  const renderedCount = ref(0);
  const previewState = shallowRef<PreviewState<GalleryImage>>(createPreviewState(images));
  const zoomState = shallowRef<ZoomState>(createZoomState());
  const isPreviewDragging = ref(false);

  const imageCache = createImageCache({
    maxEntries: Math.max(images.length, 1),
    ttl: 600_000,
  });
  const imageById = new Map(images.map((image) => [image.id, image]));
  const canRender = computed(() => images.length > 0);

  let gallery: Gallery | undefined;
  let renderer: Renderer | undefined;
  let preview: PreviewEngine<GalleryImage> | undefined;
  let zoom: ZoomManager | undefined;
  let animation: AnimationEngine | undefined;
  let resizeFrame = 0;
  let unsubscribes: Unsubscribe[] = [];
  let previewDragStart: DragSnapshot | undefined;

  const render = (): void => {
    const container = containerRef.value;

    if (!container || !renderer || !canRender.value) {
      return;
    }

    const activeLayoutMode = layoutMode.value;
    const layout = createLayout(activeLayoutMode);
    const layoutResult = layout.calculate(getLayoutImages(activeLayoutMode, images), {
      containerWidth: container.clientWidth,
    });
    const renderItems = layoutResult.items.map((item): RenderItem => {
      const image = imageById.get(item.id);

      if (!image) {
        throw new Error(`Missing gallery image for ${item.id}.`);
      }

      return {
        ...item,
        image,
      };
    });

    container.style.height = `${String(layoutResult.height)}px`;
    renderer.render(renderItems);
    bindRenderedNodes(renderItems);
    animateRenderedNodes(renderItems);
    renderedCount.value = renderItems.length;
  };

  const bindRenderedNodes = (items: readonly RenderItem[]): void => {
    items.forEach((item, index) => {
      const node = renderer?.getRenderedNode(item.id);

      if (!node) {
        return;
      }

      node.element.setAttribute("role", "button");
      node.element.tabIndex = 0;
      node.element.dataset.title = item.image.title ?? item.image.alt ?? item.id;
      node.element.onclick = () => {
        openPreview(index);
      };
      node.element.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPreview(index);
        }
      };
      node.imageElement.onload = () => {
        imageCache.set(item.image.src, {
          src: item.image.src,
          width: node.imageElement.naturalWidth,
          height: node.imageElement.naturalHeight,
          metadata: {
            id: item.id,
          },
        });
      };
    });
  };

  const animateRenderedNodes = (items: readonly RenderItem[]): void => {
    if (!animation || prefersReducedMotion()) {
      return;
    }

    const targets = items
      .map((item) => renderer?.getRenderedNode(item.id)?.imageElement)
      .filter((element): element is HTMLImageElement => element !== undefined);

    if (targets.length === 0) {
      return;
    }

    animation.cancel("scale");
    animation.play("scale", {
      target: targets,
      vars: {
        duration: 0.34,
        ease: "power2.out",
        stagger: 0.018,
      },
    });
  };

  const syncPreviewState = (state: PreviewState<GalleryImage>): void => {
    previewState.value = state;
    document.documentElement.style.overflowY = state.visible ? "hidden" : "auto";

    if (state.visible) {
      gallery?.dispatchPluginLifecycle("preview", state.item);
    }
  };

  const updatePreviewState = (state: PreviewState<GalleryImage> | undefined): void => {
    if (!state) {
      return;
    }

    syncPreviewState(state);
  };

  const updateZoomState = (state: ZoomState | undefined): void => {
    if (!state) {
      return;
    }

    zoomState.value = state;
  };

  const animatePreviewImage = (): void => {
    const figure = previewFigureRef.value;

    if (!figure || !animation || prefersReducedMotion()) {
      return;
    }

    animation.cancel("zoom");
    animation.play("zoom", {
      target: figure,
      vars: {
        duration: 0.26,
        ease: "power3.out",
      },
    });
  };

  const openPreview = (index: number): void => {
    resetZoom();
    updatePreviewState(preview?.open(index));
    void nextTick(() => {
      animatePreviewImage();
    });
  };

  const closePreview = (): void => {
    resetZoom();
    updatePreviewState(preview?.close());
  };

  const prevPreview = (): void => {
    resetZoom();
    updatePreviewState(preview?.prev());
  };

  const nextPreview = (): void => {
    resetZoom();
    updatePreviewState(preview?.next());
  };

  const getImageCenterZoomOrigin = (): { x: number; y: number } => ({
    x: zoomState.value.panX,
    y: zoomState.value.panY,
  });

  const zoomIn = (): void => {
    updateZoomState(zoom?.zoomIn(getImageCenterZoomOrigin()));
  };

  const zoomOut = (): void => {
    updateZoomState(zoom?.zoomOut(getImageCenterZoomOrigin()));
  };

  const resetZoom = (): void => {
    previewDragStart = undefined;
    isPreviewDragging.value = false;
    updateZoomState(zoom?.reset());
  };

  const onPreviewPointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }

    event.preventDefault();
    previewDragStart = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: zoomState.value.panX,
      panY: zoomState.value.panY,
    };
    isPreviewDragging.value = true;
    previewFigureRef.value?.setPointerCapture(event.pointerId);
  };

  const onPreviewPointerMove = (event: PointerEvent): void => {
    const dragStart = previewDragStart;

    if (dragStart?.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updateZoomState(
      zoom?.setPan({
        x: dragStart.panX + event.clientX - dragStart.startX,
        y: dragStart.panY + event.clientY - dragStart.startY,
      })
    );
  };

  const onPreviewPointerUp = (event: PointerEvent): void => {
    if (previewDragStart?.pointerId !== event.pointerId) {
      return;
    }

    if (previewFigureRef.value?.hasPointerCapture(event.pointerId)) {
      previewFigureRef.value.releasePointerCapture(event.pointerId);
    }

    previewDragStart = undefined;
    isPreviewDragging.value = false;
  };

  const onPreviewWheel = (event: WheelEvent): void => {
    if (event.deltaY < 0) {
      zoomIn();
      return;
    }

    if (event.deltaY > 0) {
      zoomOut();
    }
  };

  const onPreviewDoubleClick = (event: MouseEvent): void => {
    event.preventDefault();

    if (zoomState.value.zoom > zoomState.value.minZoom) {
      resetZoom();
      return;
    }

    updateZoomState(zoom?.setZoom(2, getImageCenterZoomOrigin()));
  };

  const setLayoutMode = (mode: GalleryLayoutMode): void => {
    if (!layoutModes.includes(mode) || layoutMode.value === mode) {
      return;
    }

    layoutMode.value = mode;
    gallery?.update({
      layout: {
        type: mode,
      },
    });
    gallery?.refresh();
  };

  const scheduleRender = (): void => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      gallery?.refresh();
    });
  };

  onMounted(() => {
    const container = containerRef.value;

    if (!container || !canRender.value) {
      return;
    }

    animation = new AnimationEngine({
      adapter: gsapAdapter,
    });
    registerBuiltInAnimationPresets(animation, {
      fade: { duration: 0.2 },
      scale: { duration: 0.34, fromVars: { opacity: 0, scale: 0.97 } },
      zoom: { duration: 0.26, fromVars: { opacity: 0, scale: 0.9 } },
    });

    renderer = new Renderer({
      container,
      itemClassName: "gallery-engine-item",
      imageClassName: "gallery-engine-image",
    });
    preview = new PreviewEngine<GalleryImage>({
      items: images,
      keyboard: true,
      minZoom: 1,
      maxZoom: 4,
      zoomStep: 0.25,
      onChange: syncPreviewState,
    });
    zoom = new ZoomManager({
      minZoom: 1,
      maxZoom: 4,
      zoomStep: 0.25,
      doubleClickZoom: 2,
      onChange: updateZoomState,
    });
    gallery = new Gallery({
      container,
      images,
      layout: {
        type: layoutMode.value,
      },
      preview: {
        enabled: true,
        keyboard: true,
        zoom: true,
      },
      animation: {
        enabled: true,
        enter: "scale",
        leave: "fade",
        preview: "zoom",
      },
    });

    unsubscribes = [
      gallery.on("mounted", render),
      gallery.on("layout:update", render),
    ];
    gallery.init();
    window.addEventListener("resize", scheduleRender);
  });

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(resizeFrame);
    window.removeEventListener("resize", scheduleRender);
    unsubscribes.forEach((unsubscribe) => {
      unsubscribe();
    });
    unsubscribes = [];
    preview?.destroy();
    zoom?.destroy();
    renderer?.destroy();
    gallery?.destroy();
    animation?.clear();
    imageCache.clear();
    document.documentElement.style.overflowY = "auto";
  });

  return {
    closePreview,
    containerRef,
    layoutMode,
    nextPreview,
    onPreviewDoubleClick,
    onPreviewPointerDown,
    onPreviewPointerMove,
    onPreviewPointerUp,
    onPreviewWheel,
    isPreviewDragging,
    previewFigureRef,
    previewImageRef,
    previewState,
    prevPreview,
    renderedCount,
    resetZoom,
    setLayoutMode,
    zoomIn,
    zoomOut,
    zoomState,
  };
};

const createLayout = (mode: GalleryLayoutMode): Layout<GalleryImage> => {
  if (mode === "grid") {
    return new GridLayout<GalleryImage>({
      minColumnWidth: 220,
      gap: 16,
    });
  }

  if (mode === "justified") {
    return new JustifiedLayout<GalleryImage>({
      rowHeight: 230,
      gap: 14,
    });
  }

  return new MasonryLayout<GalleryImage>({
    minColumnWidth: 240,
    gap: 16,
  });
};

const getLayoutImages = (
  mode: GalleryLayoutMode,
  images: readonly GalleryImage[]
): readonly GalleryImage[] => {
  if (mode !== "grid") {
    return images;
  }

  return images.map((image) => ({
    ...image,
    width: gridLayoutAspect.width,
    height: gridLayoutAspect.height,
  }));
};

const createPreviewState = (
  images: readonly GalleryImage[]
): PreviewState<GalleryImage> => ({
  visible: false,
  current: 0,
  zoom: 1,
  item: undefined,
  items: images,
});

const createZoomState = (): ZoomState => ({
  zoom: 1,
  minZoom: 1,
  maxZoom: 4,
  panX: 0,
  panY: 0,
  dragging: false,
  pinching: false,
});

type DragSnapshot = {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly panX: number;
  readonly panY: number;
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
