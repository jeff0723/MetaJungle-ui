import { Card, Divider, Typography } from "antd";
import React from 'react';
const { Title, Text } = Typography;

interface Props {

}
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        maxWidth: '875px'
    },
};
const QuickStart = (props: Props) => {
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>📝 How To Play</Title>}>
                <Title level={3}>🐂 Summon a Jungler</Title>
                <ul>
                    <li><Text>Deposit 1 uint of jungle resource ($JGR) in the vault to create an account</Text></li>
                    <li><Text>Each account is a ERC-721 token, which presenting a jungler that will grow up with your trading return</Text></li>
                    <li><Text>Select a trading pair to open a position</Text></li>
                    <li><Text>When there is a change of return, the metadata of your NFT will also change</Text></li>
                    <li><Text>You may also use leverage to increase your return</Text></li>
                </ul>
                <Divider />
                <Title level={3}>⚓ Gank a bankrupt jungler</Title>
                <ul>
                    <li><Text>You can gank an jungler if it is bankrupted</Text></li>
                    <li><Text>After ganking successfully, ganker will be be rewarded with 0.1 $JGR</Text></li>
                </ul>
                <Divider />
                <Title level={3}>🏝️ Hide on bush</Title>
                <ul>
                    <li><Text>There are only 100 bushes</Text></li>
                    <li><Text>When you have a powerful jungler, you can use it to camp a bush</Text></li>
                    <li><Text>You might be kicked out from your bush if other stronger jungler comes</Text></li>
                </ul>
                <Divider />
                <Title level={3}>🌱 Generations</Title>
                <ul>
                    <li><Text>Each generation lasts 28 days, 25 of fighting stage and 3 days voting</Text></li>
                    <li><Text>After the end of the fighting stage, camping junglers will share 80% of $JGR in the vault if they vote</Text></li>
                    <li><Text>After the end of the voting stage, winner amoung proposals get 10% of $JGR in the vault</Text></li>
                </ul>
                <Divider />
                <Title level={3}>📃 Proposals</Title>
                <ul>
                    <li><Text>Everyone can file a proposal for the jungler skin of next generation</Text></li>
                    <li><Text>Camping junglers vote and determine their future look</Text></li>
                    <li><Text>Better vote a nice one for nex generation to make $JGR more valuable</Text></li>
                </ul>
                <Divider />
            </Card>

        </div>
    )
}

export default QuickStart
