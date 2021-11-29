import { LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Typography } from "antd";
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import styled from 'styled-components';
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { pricePairs } from '../constants/pricePairs';
import { proxyToPairs } from '../constants/proxyToPairs';
import { resolveIPFSLink } from '../helpers/formatters';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
const { Text } = Typography
const { Option } = Select;

interface JunglerProfile {
    id: number
    generation: number
    isOpen: boolean
    isCamping: boolean
    power: number
    proxy: string
    openPrice: number
    leverage: number
    tokenURI: string
}

interface Props {
    junglerProfile: JunglerProfile
}

const StyledCard = styled('div')`
    width:198px;
    height:264px;
    border-radius:1rem;
    border: 1px solid #e7eaf3;
    display:flex;
    flex-direction:column;
    :hover{
        cursor: pointer;
        border: 2px solid #1890ff;
        .img{
            width:196px;
             height:196px
        }
    }
`
const FlexRow = styled('div')`
    display:flex;
    flex-direction:row;
`
const FlexColumn = styled('div')`
    display:flex;
    flex-direction:column;
`

const BoldText = styled(Text)`
    font-size:16px;
    font-weight: 700;
    line-height: 150%;

`
const fetchMetaData = async (tokenURI: string) => {
    const metaData = await fetch(tokenURI)
        .then(response => response.json())
        .then(data => resolveIPFSLink(data.image))
    return metaData;
}


const mapProfileArrayToObject = (profileArray: any) => {
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
const JunglerCard = ({ junglerProfile }: Props) => {
    const [profile, setProfile] = useState<JunglerProfile>(junglerProfile);
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [imageURL, setImageURL] = useState<string>()
    const [isDashBoardOpen, setIsDashBoardOpen] = useState(false);
    const [pair, setPair] = useState<string>();
    const [leverage, setLeverage] = useState<string>();
    const getJungler = async () => {
        const options = {
            chain: chainId,
            address: META_JUNGLE_ADDRESS[chainId],
            function_name: "getJunglerProfile",
            abi: MetaJungle__factory.abi,
            params: { junglerId: junglerProfile.id }
        }
        const response = await Moralis.Web3API.native.runContractFunction(options);
        return response
    }
    useEffect(() => {
        const _setImageURL = async () => {
            setImageURL(await fetchMetaData(profile.tokenURI));
        }
        _setImageURL();
    }, [profile])

    const handleOpen = () => {
        if (!leverage || !pair) {
            openNotificationWithIcon("warning", "Input not complete!", "Please compelete required input field.")
            return
        }
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'open',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: junglerProfile.id,
                    namehash: utils.namehash(pair),
                    leverage: parseInt(leverage)
                }
            };
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Open position success", 'Succesffully open a position.');
                setProfile(mapProfileArrayToObject((await getJungler())));
            })
        }

    }

    const handleClose = () => {
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'close',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: junglerProfile.id
                }
            };
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Close position success", 'Succesffully close a position.');
                setProfile(mapProfileArrayToObject((await getJungler())));
            })
        }
    }
    return (
        <>
            <StyledCard onClick={() => { setIsDashBoardOpen(true) }}>
                {imageURL ?
                    <img src={imageURL} style={{ borderRadius: '1rem' }} alt='jungleCard' />
                    :
                    <div style={{ width: '198px', height: '198px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <LoadingOutlined />
                    </div>
                }
                <div style={{ padding: '8px 16px' }}>
                    <Text>ID: {profile.id}</Text><br />
                    <Text>Power: {profile.power / 1000}</Text><br />
                </div>
            </StyledCard>
            <Modal
                visible={isDashBoardOpen}
                footer={null}
                onCancel={() => setIsDashBoardOpen(false)}>
                <FlexColumn>
                    <FlexRow style={{ gap: '32px' }}>
                        <div>
                            <img src={imageURL} width="198px" height='198px' style={{ borderRadius: '1rem' }} alt='jungleCard' />
                        </div>
                        <FlexColumn style={{ justifyContent: 'space-between' }}>
                            <BoldText>Generation: {profile.generation}</BoldText>
                            <BoldText>ID: {profile.id}</BoldText>
                            <BoldText >Power: {profile.power / 1000}</BoldText>
                            <BoldText >Position: {profile.isOpen ? "Open" : "Closed"}</BoldText>
                            {profile.isOpen ?
                                <>
                                    <BoldText >Leverage: {profile.leverage / 10}</BoldText>
                                    <BoldText >Trading pair: {proxyToPairs[profile.proxy]}</BoldText>
                                    <BoldText >Open Price: {(profile.openPrice / 1e8).toFixed(2)}</BoldText>
                                </> :
                                <></>
                            }
                        </FlexColumn>
                    </FlexRow>
                    {!profile.isOpen ?
                        <FlexColumn style={{ padding: '16px', gap: '16px', border: '1px solid #e7eaf3', marginTop: '32px', borderRadius: '16px' }}>

                            <Text>Open postion</Text>
                            <Select placeholder="Select your trading pair" value={pair} onChange={(value) => { setPair(value) }}>
                                {Object.keys(pricePairs).map((key, index) => (
                                    <Option value={pricePairs[key]}>{key}</Option>
                                ))}
                            </Select>
                            <Input placeholder="Set your leverage" value={leverage} onChange={(e) => { setLeverage(e.target.value) }} />
                            <Text style={{ fontSize: '12px', fontStyle: 'italic' }}>*note: can only between -128 ~ 127, real leverage range -12.8 ~ 12.7 </Text>
                            <Button style={{ borderRadius: '16px', background: '#1890ff', color: '#ffffff' }} onClick={handleOpen}>Open Position</Button>
                        </FlexColumn> :
                        <Button style={{ marginTop: '32px', borderRadius: '16px', background: '#1890ff', color: '#ffffff' }} onClick={handleClose}>Close Position</Button>
                    }

                </FlexColumn>
            </Modal>
        </>
    )
}

export default JunglerCard
