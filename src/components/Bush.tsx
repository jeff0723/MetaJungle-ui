
import { Button, Card, Input, Modal, Typography } from "antd";
import { resolveIPFSLink } from 'helpers/formatters';
import React, { useState } from 'react';
import { useMoralis } from "react-moralis";
import styled from 'styled-components';
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
const { Title, Text } = Typography
interface Props {
    id: number
    image: string
}

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
const FlexColumn = styled('div')`
    display:flex;
    flex-direction:column;
`

const BoldText = styled(Text)`
    font-size:16px;
    font-weight: 700;
    line-height: 150%;
`

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
const Bush = ({ id, image }: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [junglerProfile, setJunglerProfile] = useState<JunglerProfile>();
    const [campJunglerId, setCampJunglerId] = useState("");
    const [junglerImage, setJunglerImage] = useState("");
    const getJunglerOnBush = async () => {
        const options = {
            chain: chainId,
            address: META_JUNGLE_ADDRESS[chainId],
            function_name: "getJunglerProfileOnBush",
            abi: MetaJungle__factory.abi,
            params: { bushId: id.toString() }
        }
        const response = await (Moralis.Web3API.native.runContractFunction(options).catch(err => { console.log(err) }));
        console.log('catch');
        if (response) {
            let tempObject = mapProfileArrayToObject(response);
            setJunglerProfile(tempObject);
            fetch(tempObject.tokenURI)
                .then((response) => response.json())
                .then(data => { setJunglerImage(resolveIPFSLink(data.image)) })
        }

    }
    const handleCamp = () => {
        if (!campJunglerId || isNaN(parseInt(campJunglerId))) {
            openNotificationWithIcon('error', 'Input Error!', 'You need to enter number or enter number of Jungler ID you want to camp.')
        }
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'camp',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: campJunglerId,
                    bushId: id.toString()
                }
            }
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Camp success", 'Succesffully camped on a bush.');
                setCampJunglerId("");
                getJunglerOnBush();

            })
        }
    }

    return (
        <>
            <Card hoverable style={{ borderRadius: '16px', backgroundColor: '#423206ff', border: 'none' }}
                onClick={() => {
                    setIsModalOpen(true)
                }}>
                <img src={image} height='136px' width='136px' alt='bush' />
            </Card>
            <Modal visible={isModalOpen}
                footer={null}
                onCancel={() => {
                    setIsModalOpen(false)
                    getJunglerOnBush();

                }}>
                {
                    junglerProfile ?
                        <div style={{ padding: '32px' }}>
                            <Card>
                                <Title level={5} style={{ textAlign: 'center' }}>Jungler #{junglerProfile.id} on Bush</Title>
                                <FlexColumn style={{ gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={junglerImage} style={{ borderRadius: '16px' }} width='350px' height='350px' alt='jungler' />
                                    </div>
                                    <FlexColumn style={{ textAlign: 'center', gap: '5px' }}>
                                        <BoldText>Generation: {junglerProfile.generation}</BoldText>
                                        <BoldText >Power: {junglerProfile.power / 1000}</BoldText>
                                        <BoldText >Position: {junglerProfile.isOpen ? "Open" : "Closed"}</BoldText>
                                    </FlexColumn>
                                </FlexColumn>
                            </Card>
                            <div style={{ padding: '16px' }}>
                                <Text>Choose Jungler You Want to Camp on:</Text>
                                <Input placeholder='Jungler ID ex:1' style={{ marginBottom: '32px', borderRadius: '12px' }} value={campJunglerId} onChange={(e) => { setCampJunglerId(e.target.value) }} />
                                <Button type="primary" style={{ width: '100%', borderRadius: '16px' }} onClick={handleCamp}>Camp</Button>
                            </div>
                        </div> :
                        <>
                            <Title level={5}>There is no Jungler on this bush!</Title>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={image} alt='bush' width="350px" height="350px" />
                            </div>
                            <Text>Choose Jungler You Want to Camp on:</Text>
                            <Input placeholder='Jungler ID ex:1' style={{ marginBottom: '32px', borderRadius: '12px' }} value={campJunglerId} onChange={(e) => { setCampJunglerId(e.target.value) }} />
                            <Button type="primary" style={{ width: '100%', borderRadius: '16px' }} onClick={handleCamp}>Camp</Button>
                        </>
                }
            </Modal >
        </>
    )
}

export default Bush
