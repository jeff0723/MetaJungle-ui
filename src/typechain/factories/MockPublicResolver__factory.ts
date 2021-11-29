/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockPublicResolver,
  MockPublicResolverInterface,
} from "../MockPublicResolver";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
    ],
    name: "addr",
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
        name: "address_",
        type: "address",
      },
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061015e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633b3b57de1461003b578063d5fa2b0014610064575b600080fd5b61004e6100493660046100c2565b610079565b60405161005b9190610114565b60405180910390f35b6100776100723660046100da565b610094565b005b6000908152602081905260409020546001600160a01b031690565b60009182526020829052604090912080546001600160a01b0319166001600160a01b03909216919091179055565b6000602082840312156100d3578081fd5b5035919050565b600080604083850312156100ec578081fd5b8235915060208301356001600160a01b0381168114610109578182fd5b809150509250929050565b6001600160a01b039190911681526020019056fea264697066735822122045b2d64874c2e4a79ccfb0ce063ea3ea3f8b20b82e0f2cc8c95b5998462bd60464736f6c63430008000033";

export class MockPublicResolver__factory extends ContractFactory {
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
  ): Promise<MockPublicResolver> {
    return super.deploy(overrides || {}) as Promise<MockPublicResolver>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockPublicResolver {
    return super.attach(address) as MockPublicResolver;
  }
  connect(signer: Signer): MockPublicResolver__factory {
    return super.connect(signer) as MockPublicResolver__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockPublicResolverInterface {
    return new utils.Interface(_abi) as MockPublicResolverInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockPublicResolver {
    return new Contract(address, _abi, signerOrProvider) as MockPublicResolver;
  }
}