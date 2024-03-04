
import { ZIMKitManager, Common } from '@zegocloud/zimkit-react';
import '@zegocloud/zimkit-react/index.css';
import { useEffect, useState } from "react"
const ZegoChat = ({user}) =>{
    const username = user;
    console.log('username: ', username);
    const id = Math.floor(Math.random()*1000)
    const [state,setState] = useState({
        appConfig:{
            appID:1808161356,
            serverSecret:"c61b7f6edcb06e11714b3c2458bd976c"
        },
        userInfo:{
            userID:`ijaz${id}`,
            userName:`ijaz${id}`,
        }
    })
    useEffect(()=>{
        const zimkit = async()=>{
            const zimKit = new ZIMKitManager();
        const token = zimKit.generateKitTokenForTest(state.appConfig.appID, state.appConfig.serverSecret, state.userInfo.userID);
        await zimKit.init(state.appConfig.appID);
        await zimKit.connectUser(state.userInfo, token);
        }
        zimkit()
    },[])

    return(
        <>
        {state?.userInfo?.userID}
        <Common></Common>
        </>
    )
}

export default ZegoChat