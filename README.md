English | [简体中文](https://github.com/kelekexiao123/genjijs/blob/master/README_zh-CN.md)
# <img src="https://user-images.githubusercontent.com/17807197/72414887-3b7b6080-37ae-11ea-87db-d350efb54a8e.png" width="28" height="28" align="center" style="margin-right: 5px" /> Genji

[![npm version](https://img.shields.io/npm/v/genjijs.svg)](https://www.npmjs.com/package/genjijs)
[![CircleCI](https://circleci.com/gh/kelekexiao123/genjijs.svg?style=svg)](https://circleci.com/gh/kelekexiao123/genjijs)
[![Coverage Status](https://coveralls.io/repos/github/kelekexiao123/genjijs/badge.svg?branch=master)](https://coveralls.io/github/kelekexiao123/genjijs?branch=master)
[![dependencies Status](https://david-dm.org/kelekexiao123/genjijs/status.svg)](https://david-dm.org/kelekexiao123/genjijs)
[![devDependencies Status](https://david-dm.org/kelekexiao123/genjijs/dev-status.svg)](https://david-dm.org/kelekexiao123/genjijs?type=dev)
[![downloads](https://img.shields.io/npm/dm/genjijs.svg)](https://npmcharts.com/compare/genjijs?minimal=true)

A super-lightweight (core code only 5KB) data state management scheme based on `redux` and `redux-thunk`. (Inspired by [dva](https://github.com/dvajs/dva) )

---

<img src="https://user-images.githubusercontent.com/17807197/72416259-3835a400-37b1-11ea-91ed-0ca72d361802.gif" width="300" />

> 竜神の剣を喰らえ！ -- shimada genji

---

## Features :new:

* Use namespaces to separate different businesses, and centralize all data processing logic belong to the common namespace in the same place. to facilitate unified data management and provide a pluggable experience for modules.
* Enhanced `actionCreator` of `redux` to provide a more friendly data access methods. Users do not need to write `reducer` repeatedly. Unified synchronous and asynchronous experience in updating `state`.
* The built-in `loading` state for asynchronous operation makes it easier to get the current operation progress.

## Installation :gear:

Assuming you are using `npm` as your package manager, execute the following command in your project directory:

```
npm install --save genjijs
```

If you use `yarn`, you can also:
```
yarn add genjijs
```

## Quick Start :beginner:

There is a simple example in this project which used all common features of `Genji` . Click [here](https://github.com/kelekexiao123/genjijs/tree/master/example) to see。

In addition, the following demo may help you become more familiar with `Genji` :

* [example-typescript](https://codesandbox.io/s/genji-typescript-3dcoo?fontsize=14&hidenavigation=1&theme=dark)：If you want to have full `Typescript` supports, refer this.

* [TodoList](https://codesandbox.io/s/genji-todolist-v5c8t?fontsize=14&hidenavigation=1&theme=dark)：A copy of TodoList given by [example](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos) from `Redux` project, but use `Genji` to rewrite.

---

## Q & A :book:

* ### Difference from `dva`？

`dva` is an excellent open source project worldwide, and is also the source of inspiration for this project (this can be seen from the project name). Specially thanks to `dva`.

In the `dva` project, `redux-saga` is used as an asynchronous solution, which makes developers have to use the `generator` feature to make asynchronous requests, which is different from the mainstream asynchronous invocation methods which used `async` and `Promise` , and these may cause some confusion for junior developers. Therefore, in `Genji`, the `redux-thunk` written by Dan, the author of `Redux`, was adopted as our asynchronous solution.

Considering the user habits and functional enhancements brought by `redux-saga`, we have enhanced the capabilities of `redux-thunk` by hijack & injection, so that users can define asynchronous function like `redux-saga` but have supports of `async` and `Promise`.

## TODO :construction:
- [x] Built-in `loading` state for asynchronous operation
- [x] Added `save` and `pick` methods for effects to access state
  - [x] Create the `reducer` asynchronously and inject it into the original `reducer tree`
  - [x] Extend `redux-thunk` and hijack `dispatch`, to extend parameter in 
  - [x] Implement `save` & `pick`
  - [ ] Enhance `save` & `pick`, like get&set from other model or support parsing more parameter types
- [x] Add Continuous integration, eslint, and unit test.
- [x] Integrate `reducers` & `effects`
- [x] Rewrite `Aciton Type`, to support definition jumps & smart tips
- [x] A full support of `Typescript`
- [ ] Document

## LICENSE

[MIT](https://github.com/kelekexiao123/genjijs/blob/master/LICENSE)
