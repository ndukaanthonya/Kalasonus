// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KalaSonusNFT
 * @dev ERC-721 Smart Contract with EIP-2981 30% Royalty for Generative Acoustic Voice Art on Celo
 * 
 * Deployment Instructions for Celo Alfajores & Celo Mainnet:
 * 1. PLATFORM_WALLET: Set recipient address to receive 30% royalties on secondary sales.
 * 2. Deploy to Celo Alfajores Testnet:
 *    - Network RPC: https://alfajores-forno.celo-testnet.org
 *    - Chain ID: 44787
 * 3. Deploy to Celo Mainnet:
 *    - Network RPC: https://forno.celo.org
 *    - Chain ID: 42220
 */

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 is IERC165 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IERC2981 is IERC165 {
    /**
     * @dev Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
     * exchange. The royalty amount is denominated and should be paid in that same unit of exchange.
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);
}

contract KalaSonusNFT is IERC721, IERC2981 {
    string public name = "KalaSonus Acoustic Voice Art";
    string public symbol = "KALASONUS";

    uint256 private _nextTokenId = 1;
    address public owner;

    // Platform Wallet receiving 30% Royalty on secondary sales
    // CHANGE THIS ADDRESS TO YOUR LIVE PLATFORM WALLET ON CELO MAINNET
    address public platformWallet = 0x10A9f4C022E5a519822a10eF9004033C922485C9;

    // Royalty fraction: 3000 basis points = 30%
    uint256 public constant ROYALTY_BPS = 3000;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event Minted(uint256 indexed tokenId, address indexed recipient, string tokenURI);
    event RoyaltyWalletUpdated(address indexed newWallet);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Mint a new KalaSonus Voice Art NFT to recipient with IPFS tokenURI
     * @param recipient The address receiving the minted NFT
     * @param tokenURI The metadata URI pointing to IPFS/Arweave JSON
     */
    function mintNFT(address recipient, string memory tokenURI) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        _balances[recipient] += 1;
        _owners[tokenId] = recipient;
        _tokenURIs[tokenId] = tokenURI;

        emit Transfer(address(0), recipient, tokenId);
        emit Minted(tokenId, recipient, tokenURI);

        return tokenId;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    /**
     * @notice EIP-2981 Royalty Standard implementation (30% royalty to platformWallet)
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_owners[tokenId] != address(0), "Token does not exist");
        receiver = platformWallet;
        royaltyAmount = (salePrice * ROYALTY_BPS) / 10000; // 30% of sale price
    }

    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
        emit RoyaltyWalletUpdated(newWallet);
    }

    // IERC165 Interface support
    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC2981).interfaceId;
    }

    // ERC-721 standard function implementations
    function balanceOf(address _owner) external view override returns (uint256) {
        require(_owner != address(0), "Zero address owner");
        return _balances[_owner];
    }

    function ownerOf(uint256 tokenId) external view override returns (address) {
        address _owner = _owners[tokenId];
        require(_owner != address(0), "Token does not exist");
        return _owner;
    }

    function approve(address to, uint256 tokenId) external override {
        address _owner = _owners[tokenId];
        require(msg.sender == _owner || _operatorApprovals[_owner][msg.sender], "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(_owner, to, tokenId);
    }

    function getApproved(uint256 tokenId) external view override returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external override {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address _owner, address operator) external view override returns (bool) {
        return _operatorApprovals[_owner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(_owners[tokenId] == from, "Not token owner");
        require(to != address(0), "Transfer to zero address");
        require(
            msg.sender == from ||
            msg.sender == _tokenApprovals[tokenId] ||
            _operatorApprovals[from][msg.sender],
            "Transfer not authorized"
        );

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        delete _tokenApprovals[tokenId];
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external override {
        transferFrom(from, to, tokenId);
    }
}
