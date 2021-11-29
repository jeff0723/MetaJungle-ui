export const getEllipsisTxt = (str:string, n = 6) => {
    if (str) {
      return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
    }
    return "";
  };
  export const resolveIPFSLink = (url:string) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };