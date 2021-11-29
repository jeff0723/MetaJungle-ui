import { PlusOutlined } from "@ant-design/icons";
import { Card, notification, Typography } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import styled from 'styled-components';
import JungleCard from '../components/JunglerCard';
import { JUNGLE_RESOURCE, META_JUNGLE_ADDRESS } from '../constants/address';
import { resolveIPFSLink } from '../helpers/formatters';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { JungleResource__factory as JGR_factory, MetaJungle__factory } from "../typechain";
const { Text, Title } = Typography

const AddCard = styled('div')`
    border: 2px dashed #e7eaf3;
    border-radius: 1rem;
    width: 198px;
    height: 264px;
    border-spacing: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dfe1e6 ;
    :hover {
                cursor: pointer;
                border: 2px dashed #1890ff;
                color: #1890ff;
            };
`

const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        maxWidth: '960px',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    addCard: {
        border: '2px dashed #e7eaf3',
        borderRadius: '1rem',
        width: '198px',
        height: '264px',
        borderSpacing: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        "&:hover": {
            cursor: "pointer",
            background: "rgba(255,255,255,0.3)"
        }
    },

}

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
    });
};

const mapProfileArrayToObject = (profileArray) => {
    return {
        id: parseInt(profileArray[0]),
        generation: parseInt(profileArray[1]),
        isOpen: profileArray[2],
        isCamping: profileArray[3],
        power: parseInt(profileArray[4]),
        proxy: profileArray[5],
        openPrice: parseInt(profileArray[6]),
        leverage: parseInt(profileArray[7]),
        tokenURI: resolveIPFSLink(profileArray[8])
    }
}
const Collections = () => {
    const { isWeb3Enabled, web3, enableWeb3 } = useMoralis();
    const { native, token } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();
    const [metaJungleAddress, setMetaJungleAddress] = useState("");
    const [jungleResourceAdrress, setJungleResourceAddress] = useState("")
    const [allowance, setAllowance] = useState("0");
    const [junglerProfileList, setJunglerProfileList] = useState([]);
    useEffect(() => {
        const getAllowance = async () => {
            const options = {
                chain: chainId,
                owner_address: walletAddress,
                spender_address: metaJungleAddress,
                address: jungleResourceAdrress
            };
            console.log('get allowance:')
            const { allowance } = await token.getTokenAllowance(options).then(result => (result));
            setAllowance(allowance);
            console.log("allowance:", allowance)
        }
        const setJunglerProfileListAsync = async () => {
            setJunglerProfileList(await getJunglerList());
        }
        if (chainId && !metaJungleAddress && !jungleResourceAdrress) {
            setMetaJungleAddress(META_JUNGLE_ADDRESS[chainId]);
            setJungleResourceAddress(JUNGLE_RESOURCE[chainId]);
        }
        if (walletAddress && !isWeb3Enabled) {
            enableWeb3();
        }
        if (jungleResourceAdrress && walletAddress && chainId) {
            getAllowance()
        }
        if (chainId && metaJungleAddress && walletAddress) {
            setJunglerProfileListAsync();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, walletAddress, metaJungleAddress, jungleResourceAdrress])

    const getJunglerList = async () => {
        const options = {
            chain: chainId,
            address: metaJungleAddress,
            function_name: "getOwnerJunglerList",
            abi: MetaJungle__factory.abi,
            params: { owner: walletAddress }
        }
        const response = await native.runContractFunction(options);
        return response
    }
    const handleCreateBreed = async () => {
        if (!walletAddress) {
            openNotificationWithIcon("warning", "Wallet Connect Warning", 'You need to connect to wallet to perform this action.');
            return;
        }
        if (!metaJungleAddress || !web3 || !isWeb3Enabled) return;

        if (!+allowance) {
            const contract = new web3.eth.Contract(JGR_factory.abi, jungleResourceAdrress, { gas: 1000000, gasPrice: "2000000000" })
            contract.methods
                .approve(metaJungleAddress, ethers.constants.MaxUint256)
                .send({ from: walletAddress })
                .then((response) => {
                    openNotificationWithIcon("success", "Approval success", 'Succesffully approve smart contract to use your token!');
                    setAllowance(ethers.constants.MaxUint256);
                })
        }
        else {
            const contract = new web3.eth.Contract(MetaJungle__factory.abi, metaJungleAddress)
            contract.methods
                .summon()
                .send({ from: walletAddress })
                .then(async (response) => {
                    openNotificationWithIcon("success", "Summon success", 'Succesffully summon a jungler!');
                    setJunglerProfileList(await getJunglerList());
                })
        }
    }

    const renderJunglerList = () => {
        if (junglerProfileList.length) {
            return junglerProfileList.map((item, index) => (
                <JungleCard junglerProfile={mapProfileArrayToObject(item)} />
            ));
        }
    }

    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>💰 Inventory</Title>}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '16px'
                }}>
                    <AddCard onClick={handleCreateBreed}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: '16px',
                        }}>
                            <PlusOutlined style={{ fontSize: '24px' }} />
                            <Text style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '10px' }}>{!junglerProfileList.length ? "Summon your first Jungler!" : "Summon a Jungler"}</Text>
                            <Text>{!junglerProfileList.length ? "This is the first step to participate meta jungle and fight for glory." : "Click button to summon a Jungler."}</Text>
                        </div>
                    </AddCard>
                    {renderJunglerList()}

                </div>
            </Card >
        </div >
    )
}

export default Collections
