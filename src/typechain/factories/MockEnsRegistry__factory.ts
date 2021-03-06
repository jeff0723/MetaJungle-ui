/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockEnsRegistry,
  MockEnsRegistryInterface,
} from "../MockEnsRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
    ],
    name: "resolver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "resolverAddr",
        type: "address",
      },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061015e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630178b8bf1461003b5780631896f70a14610064575b600080fd5b61004e6100493660046100c2565b610079565b60405161005b9190610114565b60405180910390f35b6100776100723660046100da565b610094565b005b6000908152602081905260409020546001600160a01b031690565b60009182526020829052604090912080546001600160a01b0319166001600160a01b03909216919091179055565b6000602082840312156100d3578081fd5b5035919050565b600080604083850312156100ec578081fd5b8235915060208301356001600160a01b0381168114610109578182fd5b809150509250929050565b6001600160a01b039190911681526020019056fea2646970667358221220084b2bf79176c09d01c6bb4a09ef20e980e88723d6893f3f5dfbeba2d4771db964736f6c63430008000033";

export class MockEnsRegistry__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockEnsRegistry> {
    return super.deploy(overrides || {}) as Promise<MockEnsRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockEnsRegistry {
    return super.attach(address) as MockEnsRegistry;
  }
  connect(signer: Signer): MockEnsRegistry__factory {
    return super.connect(signer) as MockEnsRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockEnsRegistryInterface {
    return new utils.Interface(_abi) as MockEnsRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockEnsRegistry {
    return new Contract(address, _abi, signerOrProvider) as MockEnsRegistry;
  }
}
