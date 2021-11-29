import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from "antd";
import { utils } from 'ethers';
import React from 'react';
import { useMoralis } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
const { Title } = Typography
interface Props {

}


const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
    },
}

const Proposal = (props: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'propose',
                abi: MetaJungle__factory.abi,
                params: {
                    newBaseURI: values.baseURI,
                    slotId: values.slotId,
                },
                msgValue: utils.parseEther(values.bidPrice).toString()
            };
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Submit proposal success", 'Succesffully submit a proposal;.');
            })
            form.setFieldsValue({
                baseURI: '',
                slotId: '',
                bidPrice: ''
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }
    return (
        <div>
            <Card style={{ ...styles.card, minWidth: '375px', width: '50vw', maxWidth: '575px' }} title={<Title level={2}>💰 Make a Proposal</Title>}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 36 }}
                    layout='vertical'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    <Form.Item
                        label="BaseURI"
                        name="baseURI"
                        tooltip={{ title: 'BaseURI is a ipfs URI which stores your design material. For our proposal, you need 1000 image in BaseURI.', icon: <InfoCircleOutlined /> }}
                        rules={[{ required: true, message: 'Please input a baseURI !' }]}
                    >
                        <Input placeholder="ipfs://" />
                    </Form.Item>

                    <Form.Item
                        label="SlotID"
                        name="slotId"
                        tooltip={{ title: 'We have maximum 10 slots for proposal. In the end of proposal period, our users can vote for your proposal. If you win, you will be rewarded 70% of the token in our pool.', icon: <InfoCircleOutlined /> }}
                        rules={[{ required: true, message: 'Please input a slot ID!' }]}
                    >
                        <Input placeholder='ex: 1' />
                    </Form.Item>
                    <Form.Item
                        label="BID Price"
                        name="bidPrice"
                        tooltip={{ title: "To secure your proposal slot, lock some money into the slot. It will be collected if you win. Others have to outbid your price to make a proposal. The bid amount will be returned if you didn't win in the end.", icon: <InfoCircleOutlined /> }}
                        rules={[{ required: true, message: 'Please input a bid price!' }]}
                    >
                        <Input placeholder='ETH' />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Proposal
