pragma solidity >=0.4.21 <0.6.0;
//pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/utils/Address.sol";
import '../../zokrates/code/square/Verifier.sol';
import "./ERC721Mintable.sol";
//  define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

contract SqVerifier is Verifier{

}

//  define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is  ERC721Token{
    SqVerifier public Contract;

    constructor(address contractAddress) ERC721Token() public
          {
              Contract = SqVerifier(contractAddress);

          }     


//  define a solutions struct that can hold an index & an address
struct Solutions{
    uint tokenId;
    address tokenAddress;

}

// define an array of the above struct
Solutions[] SolutionsArray;

// define a mapping to store unique solutions submitted
mapping (bytes32 => Solutions) private uniqueSolutions;


//  Create an event to emit when a solution is added

event SolutionAdded(uint tokenid,address tokenAddress);

//  Create a function to add the solutions to the array and emit the event

function AddSolution(address _tokenAddress,uint _tokenId,bytes32 key)  public
{
    Solutions memory solution = Solutions({tokenId:_tokenId,tokenAddress:_tokenAddress});
    SolutionsArray.push(solution);
    uniqueSolutions[key] = solution;
    emit SolutionAdded(_tokenId,_tokenAddress);
}


//  Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintNewToken(address _tokenAddress,uint _tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,  
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public
{
    bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
    require(uniqueSolutions[key].tokenAddress == address(0),"Solution is already used.");
    require(Contract.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input)," Solution isn't valid");
    
    AddSolution(_tokenAddress,_tokenId,key);
    super.mint(_tokenAddress,_tokenId);
}



}
