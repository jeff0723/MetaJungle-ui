import React, { useState } from 'react'
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Typography, Modal, Card, Button } from 'antd'
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";

import Address from './Address'
const { Text } = Typography

const styles = {
    account: {
        height: "42px",
        padding: "0 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        borderRadius: "12px",
        backgroundColor: "rgb(244, 244, 244)",
        cursor: "pointer",
    },
    text: {
        color: "#1890ff",
    },
};
const Account = () => {
    const { authenticate, isAuthenticated, logout } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    if (!isAuthenticated || !walletAddress) {
        return (
            <div
                style={styles.account}
                onClick={() => authenticate({ signingMessage: "Hello World!" })}
            >
                <Text style={styles.text}>Authenticate</Text>
            </div>
        );
    }

    return (
        <>
            <div style={styles.account} onClick={() => setIsModalVisible(true)}>
                <Text style={{ marginRight: "5px", ...styles.text }}>
                    {getEllipsisTxt(walletAddress, 6)}
                </Text>
                <Blockie />
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                bodyStyle={{
                    padding: "15px",
                    fontSize: "17px",
                    fontWeight: "500",
                }}
                style={{ fontSize: "16px", fontWeight: "500", borderRadius: '16px' }}
                width="400px"
            >
                Account
                <Card
                    style={{
                        marginTop: "10px",
                        borderRadius: "16px",
                    }}
                    bodyStyle={{ padding: "15px" }}>
                    <Address
                        avatar="left"
                        size={6}
                        copyable
                        style={{ fontSize: "20px" }}
                    />
                    <div style={{ marginTop: "10px", padding: "0 10px" }}>
                        <a
                            href={`${getExplorer(chainId)}/address/${walletAddress}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <SelectOutlined style={{ marginRight: "5px" }} />
                            View on Explorer
                        </a>
                    </div>
                </Card>
                <Button
                    size="large"
                    type="primary"
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        borderRadius: "0.5rem",
                        fontSize: "16px",
                        fontWeight: "500",
                    }}
                    onClick={() => {
                        logout();
                        setIsModalVisible(false);
                    }}
                >
                    Disconnect Wallet
                </Button>
            </Modal>
        </>
    )
}

export default Account
