学习笔记


简单语句：
  ExpressionStatement: 表达式语句
  EmptyStatement: 空语句
  DebuggerStatement: debugger
  ThrowStatement: throw
  ContinueStatement: continue
  BreakStatement: break
  Returntatement: return

复合语句：
  BlockStatement: {} 块：可包含多个语句
  IfStatement: if else
  SwitchStatement: switch
  IterationStatement: for( /in/of),(do)while,for await( of )
  WithStatement: with
  LabelledStatement: 如leve1: for(),在for语句前面给该语句命名leve1，在嵌套的for里面可以break/continue指定名称的for
  TryStatement: try

声明：
  FunctionDeclaration: function
    GeneratorDeclaration: function*
    AsyncFunctionDeclaration: async function
    AsyncGeneratorDeclaration: async function*
  VariableStatement: var
  ClassDeclaration: class
  LexicalDeclaration: const let
  前4种作用范围是：Function Body,没有先后关系

预处理：所有声明都有预处理机制
  var会被提升到函数作用级别

宏任务&微任务
  JS执行粒度（运行时）
    宏任务：
      （UI rendering、I/O、setTimeout、setInterval、requestAnmationFrame<在node中没有>、setImmediate<在浏览器中没有>）
    微任务：
      （Promise、process.nextTick<在浏览器中没有>、MutationObserver<node没有>）
    函数调用（Execution Context）
    语句/声明（Completion Record）
    表达式（Refernce）
    直接量/变量/this ......

  任务的优先级：
    宏任务macrotask：主代码块 > setImmediate > MessageChannel > setTimeout / setInterval (大部分浏览器会把DOM事件回调优先处理 因为要提升用户体验 给用户反馈，其次是network IO操作的回调，再然后是UIrender，之后的顺序就看情况，不同浏览器的表现也不太一样)

    微任务microtask：process.nextTick > Promise = MutationObserver

函数调用：
  Running Execution Context（保存了运行时时所需的所有数据）
    Execution Context Stack
      Execution Context
        code evaluation state （保存async、generator函数执行步骤信息）
        Function
        Script or Module
        Generator(Generator每次执行都生成隐藏的Generator)
        Realm（保存内置对象的领域）
        LexicalEnvironment（执行环境所需的变量）
          this
          new.target
          super
          变量
        VariableEnvironment（var声明的变量）
  
  Environment Record
    Declarative
      Function
      midule
    Global
    Object