---
createTime: 2024-04-22
tags:
  - react
cover: /forests.jpg
---

### useCallback

effect: cached functions during multiple rendering

```tsx
const cachedFn = useCallback(fn, deps)
```

#### use useCallback like following condition it is meaningful

##### 1. skip the rerendering of the child component. (use it with memo)

```tsx
const FatherComponent = ({theme, vid}) => {
  const [content, setContent] = useState('');

  const onClickEvt = useCallback(async () => {
    const res = await fetch('/getSomethingRandom/' + vid);
    setContent(res.json());
  }, [vid]);


  return (
    <div className={theme}>
      <div>
        {content}
      </div>
      <ChildComponent onClick={onClickEvt} />
    </div>
  );
}

const ChildComponent = memo(({onClickEvt}) => {
  return (
    <button onClick={onClickEvt} >click me</button>
  );
})
```

If you don not wrap onClickEvt with useCallback, a new function will be generated when the FatherComponent rerenders due to the theme props has changed each time, the props is always different for ChildComponent, and it will be rerendered. Otherwise, the ChildComponent will be rerendered only when vid is different.

##### 2. fewer dependencies.

```tsx
const TodoList = () => {
  const [todos, setTodos] = useState<{
    id: number
    text: string
  }[]>([]);

  const addTodos = useCallback((id: number, text: string) => {
    setTodos([
      ...todos,
      {id, text}
    ]);
  }, [todos]);
}
```

If you want to update the state based on the previous state, you could use [updater function](https://zh-hans.react.dev/reference/react/useState#updating-state-based-on-the-previous-state).

```tsx
const TodoList = () => {
  ...
  const addTodos = useCallback((id: number, text: string) => {
    setTodos(todos => [
      ...todos,
      {id, text}
    ]);
  }, []);
}
```

todos in here is not the state variable itself, it is just a param in the updater function, so you could remove the dependency.

##### 3. prevent the useEffect from being triggered frequently. (use it with useEffect)

```tsx
const ChatRoom = ({roomId}) => {
  const generateOptions = () => {
    return {
      roomId,
      url: '/chatroom'
    }
  }

  useEffect(() => {
    const options = generateOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [generateOptions]);
}
```

generateOptions function is a responsive value, it is used in the useEffect, so it must be added into the dependencies. But a new generateOptions function will be generated when the ChatRoom rerenders, and the useEffect will be executed. This is not correct.

```tsx
const ChatRoom = ({roomId}) => {
  const generateOptions = useCallback(() => {
    return {
      roomId,
      url: '/chatroom'
    }
  }, [roomId]);

  useEffect(() => {
    const options = generateOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [generateOptions]);
}
```

Wrap the generateOptions function with useCallback, the generateOptions function will be changed only when roomId has changed, and the useEffect will be changed only when generateOptions has changed. The more simple method is move the generateOptions function into the useEffect and you do not need useCallback anymore.

```tsx
const ChatRoom = ({roomId}) => {
  useEffect(() => {
    const generateOptions = () => {
      return {
        roomId,
        url: '/chatroom'
      }
    }

    const options = generateOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

##### 4. optimize custom hooks.

```tsx
const useRouter = () => {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

It make sure that hook users could optimize their own codes when needed.

### useContext

effect: pass data through the component tree

```tsx
const value = useContext(SomeContext);
```

#### no matter how many levels in your component tree

props can only pass data level by level. It is complex to do like this.

```tsx
const FatherComponent = ({theme}) => {
  const [text, setText] = useState('some text');

  return (
    <ChildComponent 
      theme={theme}
      text={text}
    />
  )
}

const ChildComponent = ({theme, text}) => {
  return (
    <div className={theme + '-mode'}>
      <p>{text}</p>
      <ThemeButton theme={theme} />
    </div>
  )
}

const ThemeButton = ({theme}) => {
  return (
    <button className={theme + '-mode'}>
      click me
    </button>
  )
}
```

use useContext is a better method.

```tsx
const ThemeContext = createContext('light'); // assign default value.

const FatherComponent = ({theme}) => {
  const [text, setText] = useState('some text');

  return (
    // if there is no value to assign, useContext will get the default value.
    // if the theme has changed, the places where it was used will be rerendered too.
    <ThemeContext.Provider value={theme}>
      <ChildComponent text={text} />
    </ThemeContext.Provider>
  )
}

// you do not need theme props anymore.
const ChildComponent = ({text}) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={theme + '-mode'}>
      <p>{text}</p>
      <ThemeButton />
    </div>
  )
} 

// you do not need theme props anymore.
const ThemeButton = () => {
  const theme = useContext(ThemeContext);

  return (
    <button className={theme + '-mode'}>
      click me
    </button>
  )
}
```

#### extract the provider into a component

```tsx
// ThemeProvider.tsx
const ThemeContext = createContext('light');

const ThemeProvider = ({children, theme}) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;

// any other tsx files
import ThemeProvider from './ThemeProvider.tsx';

const FatherComponent = ({theme}) => {
  const [text, setText] = useState('some text');

  return (
    <ThemeProvider theme={theme}>
      <ChildComponent text={text} />
    </ThemeProvider>
  )
} 

const ChildComponent = ({text}) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={theme + '-mode'}>
      <p>{text}</p>
      <ThemeButton />
    </div>
  )
} 

const ThemeButton = () => {
  const theme = useContext(ThemeContext);

  return (
    <button className={theme + '-mode'}>
      click me
    </button>
  )
}
```

#### optimize rerendering when passing objects and functions

```tsx
const SomeContext = createContext(null);

const Root = () => {
  const [userInfo, setUserInfo] = useState(null);

  const login = useCallback((response) => {
    setUserInfo(response.userInfo);
  }, []);

  const contextVal = useMemo(() => ({
    userInfo,
    login
  }), [userInfo, login]);

  return (
    <SomeContext.Provider value={contextVal}>
      <Page />
    </SomeContext.Provider>
  )
}
```

the places where the useContext(SomeContext) was used will not be rerendered when Root component has rerendered, except the userInfo object has changed.

### useRef

effect: reference a value that does not need to be rendered.

```tsx
//returns an object with a single current attribute
const ref = useRef(initValue);
```

#### change ref will not trigger rerendering. (if you want, use state instead)

you could store some values which will not influence views and use it in the future. Sucn as timer id.

```tsx
const timerRef = useRef(null);

const handleStart = () => {
  timerRef.current = setInterval(() => {
    ...
  }, 1000)
}

const handleStop = () => {
  clearInterval(timerRef.current);
  timerRef.current = null;
}
```

#### do not write and read ref current during rendering

```tsx
const ComponentFc = () => {
  const ref = useRef();

  // write
  ref.current = someValue;

  // read
  return(
    <h1>{ref.current}</h1>
  )
}
```

writing or reading during rendering will lead to unexpected result. But in the event handler or the useEffect you could write and read it.

```tsx
const ComponentFc = () => {
  const ref = useRef();

  useEffect(() => {
    ref.current = someValue;
  }, []);

  const handleClick = () => {
    clearInterval(ref.current);
  }
}
```

#### operate dom by ref

```tsx
  const MyInput = () => {
    const inputRef = useRef(null);

    return (
      <input ref={inputRef} />
    )
  }
```

when the input element is rendered to the screen, you could get it with current attribute.

#### avoid initializing repeatedly

```tsx
const ComponentFc = () => {
  const init = () => ({
    name: 'fish',
    age: 30
  });

  const ref = useRef(init());
}
```

initializing a value with calling a method, the method will be called when rerendering every time. You could initialize a value like following.

```tsx
const ComponentFc = () => {
  const init = () => ({
    name: 'fish',
    age: 30
  });

  const ref = useRef(null);

  if(ref.current === null) {
    ref.current = init();
  }
}
```

generally you should not write and read during rendering, but in this condition, the behaviour is expected, it is allowed.


