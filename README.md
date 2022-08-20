# FVM Client Tool
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GithubActions](https://github.com/Zondax/fvm-client-tool/actions/workflows/main.yaml/badge.svg)](https://github.com/Zondax/fvm-client-tool/blob/master/.github/workflows/main.yaml)

---

![zondax_light](docs/assets/zondax_light.png#gh-light-mode-only)
![zondax_dark](docs/assets/zondax_dark.png#gh-dark-mode-only)

_Please visit our website at [zondax.ch](https://www.zondax.ch)_

---

This project is meant to be used as a client library to interact with your smart contracts. You will be
able to install, instantiate and invoke methods of your smart contract. This is a JS package you can import
easily in your project. 

Please, check the example folder in order to get more intel on how to use the client tool. It is super easy!

## Guidelines

### Install
To install a smart contract, you just need your binary file.

### Instantiate
To create a new instance of that smart contract, you need the ABI and the CID you get when installing the binary file.

### Interact
To interact with it, you need the ABI and one of two paths: the CID you get when installing the smart contract, or the address of your smart contract instance.

