import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, List, Modal, Typography } from "antd";
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { getEllipsisTxt, resolveIPFSLink } from '../helpers/formatters';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
const { Title, Text } = Typography

interface Props {

}
interface ProposalData {
    proposer: string
    baseURI: string
    bid: number
    voteCount: number
}
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
    },
}

const mapArrayToProposal = (array: any): ProposalData => {
    return {
        proposer: array[0],
        baseURI: array[1],
        bid: array[2],
        voteCount: array[3]
    }
}
const Vote = (props: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [proposalList, setProposalList] = useState<ProposalData[]>();
    const [walletVotableBushesList, setWalleVotableBushesList] = useState([]);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [voteAmount, setVoteAmount] = useState("");
    const [proposalId, setProposalId] = useState(0);
    useEffect(() => {
        const getAllProposals = async () => {
            if (chainId && walletAddress) {
                const options = {
                    chain: chainId,
                    address: META_JUNGLE_ADDRESS[chainId],
                    function_name: 'getAllProposals',
                    abi: MetaJungle__factory.abi,
                };
                let response = (await Moralis.Web3API.native.runContractFunction(options).then(response => response)) as Array<[]>;
                setProposalList(response.map((item) => mapArrayToProposal(item)));
            }
        }
        const getVotableList = async () => {
            if (chainId && walletAddress) {
                const options = {
                    chain: chainId,
                    address: META_JUNGLE_ADDRESS[chainId],
                    function_name: 'getVotableBushesByOwner',
                    abi: MetaJungle__factory.abi,
                    params: {
                        owner: walletAddress
                    }
                };
                let response = (await Moralis.Web3API.native.runContractFunction(options).then(response => response)) as [];
                setWalleVotableBushesList(response);
            }
        }

        getAllProposals();
        getVotableList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, chainId])

    const handleVote = (number: string) => {
        if (!number || isNaN(parseInt(number))) {
            openNotificationWithIcon('error', 'Input Error!', 'You need to enter number or enter amout you want to vote.')
        }

        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'vote',
                abi: MetaJungle__factory.abi,
                params: {
                    proposalId: proposalId.toString(),
                    bushIdList: walletVotableBushesList.slice(0, parseInt(number))
                }
            }
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Vote success", 'Succesffully vote for a proposal.');
                setProposalId(0);
            })
        }

    }
    return (
        <div>
            <Card style={{ ...styles.card, minWidth: '375px', width: '50vw', maxWidth: '875px' }} title={<Title level={2}>💰 Vote for a Proposal</Title>}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Text>Your Votes: {walletVotableBushesList.length}</Text>
                </div>
                <List
                    dataSource={proposalList}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={`Proposal #${index}`}
                                description={getEllipsisTxt(item.proposer)}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                                <span>{utils.formatEther(item.bid.toString())} ETH</span>
                                <span>{parseInt(utils.formatEther(item.voteCount.toString()))} Vote(s)</span>
                                <a href={resolveIPFSLink(item.baseURI)} target="_blank" rel="noreferrer">View Proposal</a>
                                <Button type="primary" style={{ borderRadius: '16px' }} onClick={() => {
                                    setIsVoteModalOpen(true)
                                    setProposalId(index)
                                }}>Vote</Button>
                            </div>
                        </List.Item>
                    )}
                >

                </List>
            </Card>
            <Modal
                visible={isVoteModalOpen}
                footer={null}
                onCancel={() => setIsVoteModalOpen(false)}
                title={<Text>Submit your vote(s)</Text>}
                width='375px'
            >
                <div>
                    <Text>Number to Vote:</Text>
                    <Input placeholder='votes' style={{ width: '300px', marginBottom: '32px' }} value={voteAmount} onChange={(e) => setVoteAmount(e.target.value)} /><br />
                    <Button type="primary" style={{ borderRadius: '16px' }} onClick={() => { handleVote(voteAmount) }}>
                        Submit
                    </Button>
                </div>
            </Modal>
        </div >
    )
}

export default Vote
