import React, { Component } from 'react';
import './App.css';
import Store from './store'

var classNames = require('classnames')
/****************************
 *
 *        Header组件
 *
 * **************************/
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { newTodo: "", counter: 0 };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleChange(event) {//当输入框内的值发生变化，同时更新newTodo
    this.setState({ newTodo: event.target.value });
  };
  handleKeyUp(event) { //当用户敲击enter，把输入的值生成一个对象，添加进todolist之中
    if (event.keyCode === 13 && this.state.newTodo.length > 0) {
      const todo = {
        id: this.state.counter + Date.parse(new Date()),  //作为key，唯一
        msg: this.state.newTodo.trim(),
        isCompleted: false,   //完成状态
        isEdit: false,          //编辑状态
      }
      this.props.addTodo(todo);   //调用父级方法修改父级中的state
      this.setState((prevState) => ({  //清空是输入框，并将counter+1作为下一个key
        newTodo: "",
        counter: prevState.counter + 1
      }))
    }

  }
  render() {
    return (
      <header className="header">
        <h1>myTodos</h1>
        <input className="new-todo"
          type="text"
          autoFocus autoComplete="off"
          placeholder="What needs to be done?"
          value={this.state.newTodo} //将value的值与newTodo绑定
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp} />
      </header>
    );
  }
}
/****************************
 *
 *        Todo组件
 *
 * **************************/
class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { editText: "", }
    this.handleCompleted = this.toggle.bind(this, this.props.todo, "c");//更改isCompleted状态
    this.handleEdit = this.toggle.bind(this, this.props.todo, "e");//更改isEdit状态
    this.remove = this.remove.bind(this, this.props.todo);       //移除todo
    this.editing = this.editing.bind(this, this.props.todo);      //显示编辑界面
    this.finishEdit = this.finishEdit.bind(this, this.props.todo);//完成编辑
    this.handleBlur = this.handleBlur.bind(this, this.props.todo);//失去焦点时
    this.editChange = this.editChange.bind(this);//同步修改editText
    this.editFocus = this.editFocus.bind(this);//自动获取焦点
  }
  componentDidUpdate() {//组件更新完成之后，调用获取焦点函数
    this.editFocus();
  }
  toggle(todo, type) {  //改变单个todo的状态
    const obj = {
      id: todo.id,
      isCompleted: type === "c" ? !todo.isCompleted : todo.isCompleted,
      isEdit: type === "e" ? !todo.isEdit : todo.isEdit,
    }
    this.props.toggleOne(obj); //调用父级的父级传递的方法
  }
  remove(todo) {    //删除某个todo
    const obj = {
      id: todo.id  //根据id删除
    }
    this.props.rmTodo(obj);
  }
  editing(todo) {//编辑某个todo
    this.handleEdit();
    this.setState({ editText: todo.msg });
  }
  editFocus() {
    // 直接使用原生 API 使 text 输入框获得焦点
    this.editInput.focus();
  }
  editChange(event) {//当输入框内的值发生变化，同时更新editText
    this.setState({ editText: event.target.value });
  };

  finishEdit(todo, event) {
    if (event.keyCode === 13) {//按下enter时
      const obj = {
        id: todo.id,
        msg: this.state.editText.trim(),
        isEdit: false,
      }
      this.props.toggleOne(obj);
      this.setState({ editText: "" });
    }
    else if (event.keyCode === 27) {  //按下ESC时
      this.handleEdit();
      this.setState({ editText: "" });
    }
  }
  handleBlur(todo) {  //失去焦点时，关闭编辑
    const obj = {
      id: todo.id,
      isEdit: false,
    }
    this.props.toggleOne(obj);
    this.setState({ editText: "" });
  }
  render() {
    return (
      <li className={classNames('todo', { editing: this.props.todo.isEdit, completed: this.props.todo.isCompleted })}>
        <div className="view">
          <input className="toggle" type="checkbox"
            checked={this.props.todo.isCompleted}
            onChange={this.handleCompleted} />
          <label onDoubleClick={this.editing}>{this.props.todo.msg}</label>
          <button className="destroy" onClick={this.remove}></button>
        </div>
        <input className="edit" type="text"
          value={this.state.editText}
          onKeyUp={this.finishEdit}
          onChange={this.editChange}
          onBlur={this.handleBlur}
          ref={(input) => { this.editInput = input; }} />
      </li>
    )
  }
}

/****************************
 *
 *        TodoList组件
 *
 * **************************/
function TodoList(props) {
  const listItems = props.filterList.map((todo) =>
    <Todo key={todo.id}
      todo={todo}
      toggleOne={props.toggleOne}
      rmTodo={props.rmTodo} />
  ).reverse();//从数组尾部开始渲染。
  function toggleAll(event) {  //改变所有todo的isCompletedd
    const value = event.target.checked;
    console.log(event.target)
    props.toggleAll(value);
  }
  return (
    <section className="main">
      {props.length > 0 &&//条件渲染
        <input className="toggle-all" type="checkbox" checked={props.isAll} onChange={toggleAll} />
      }

      <ul className="todo-list">
        {listItems}
      </ul>
    </section>
  )
}



/****************************
 *
 *        Footer组件
 *
 * **************************/
function Footer(props) {
  const visibility = props.visibility;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.remaining.length}</strong> {props.remaining.length > 1 ? 'items' : 'item'} left
        </span>
      <ul className="filters">
        <li><a href="#/all" className={classNames({ selected: visibility === "all" })}>All</a></li>
        <li><a href="#/active" className={classNames({ selected: visibility === "active" })}>Active</a></li>
        <li><a href="#/completed" className={classNames({ selected: visibility === "completed" })}>Completed</a></li>
      </ul>
      <button className="clear-completed" onClick={props.clearCompleted}>
        Clear completed
        </button>
    </footer>
  );
}


/****************************
 *
 *        App组件
 *
 * **************************/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { todoList: Store.fetchList(), visibility: "all", }
    this.addTodo = this.addTodo.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.rmTodo = this.rmTodo.bind(this);
    this.filters = this.filters.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.hashChange = this.hashChange.bind(this)

  }
  componentWillMount() {   //监听url变化
    window.addEventListener('hashchange', this.hashChange)
  }
  componentDidUpdate() {//组件更新完成之后，调用获取焦点函数
    Store.save(this.state.todoList)
  }
  hashChange(){//hash值改变时，根据hash值更改visibility
      let hashName = window.location.hash.replace(/#\/?/, '').toLowerCase();
      const filtersA = ['all', 'active', 'completed'];
      if (filtersA.includes(hashName)) {
        this.setState({
          visibility: hashName
        })
      }
      else {
        window.location.hash = '';
        this.setState({
          visibility:"all"
        })
      }
    }
  toggleAll(value) {
    console.log(value);
    const todos = this.state.todoList.slice();
    todos.forEach(function (todo) {
      todo.isCompleted = value
    })
    this.setState({
      todoList: todos
    })
  }
  filters(type) {   //过滤器，相当于switch
    const todos = this.state.todoList.slice();
    const filter = {
      all: function () {
        return todos;
      },
      active: function () {
        return todos.filter((todo) => !todo.isCompleted)
      },
      completed: function () {
        return todos.filter((todo) => todo.isCompleted)
      },
    }
    if (typeof filter[type] !== 'function') {
      return [];
    }
    return filter[type]();
  }
  toggleOne(obj) {   //更改每一个Todo的状态，内容
    const todos = this.state.todoList.slice();
    const index = todos.findIndex((element) => {
      return element.id === obj.id;
    })
    if (index >= 0) {
      Object.assign(todos[index], obj);
      this.setState({
        todoList: todos
      });
    }
  }
  addTodo(todo) {
    if (todo) {
      const todos = this.state.todoList.slice();
      todos.push(todo);
      this.setState({
        todoList: todos
      });
    }
  }
  rmTodo(todo) {  //移除todo
    const todos = this.state.todoList.slice();
    const index = todos.findIndex((element) => {
      return element.id === todo.id;
    })
    todos.splice(index, 1);
    this.setState({
      todoList: todos
    });
  }
  clearCompleted() { //清除已完成的todo
    this.setState(prevState => ({
      todoList: this.filters("active")
    }))
  }
  render() {
    let filterL = this.filters(this.state.visibility);//根据visibility显示不同状态的todo
    let remaining = this.filters("active");  //过滤出未完成的
    let isAll = remaining.length === 0 ? true : false;//是否全部已完成
    return (
      <section className="todoapp">
        <Header addTodo={this.addTodo} />
        <TodoList length={this.state.todoList.length}
          filterList={filterL}
          toggleOne={this.toggleOne}
          rmTodo={this.rmTodo}
          toggleAll={this.toggleAll}
          isAll={isAll} />
        <Footer remaining={remaining} clearCompleted={this.clearCompleted} visibility={this.state.visibility} />
      </section>
    );
  }
}

export default App;
