import * as React from "react";
import ReactWebChat, {
    createDirectLine, createStore,
    createCognitiveServicesSpeechServicesPonyfillFactory
} from 'botframework-webchat';
//import ReactHTMLParser from 'html-react-parser'; 


// import {  isMobile  } from "react-device-detect";
// import { useEffect } from 'react';
// import styles from './ChatbotPanel.module.scss';
// import { TenantPropertiesRepository } from '../../repositories/TenantPropertiesRepository';
// import { customPanel } from "./customPanel";
// import {customHubWelcomeWizardRenderer} from "./customHubWelcomeWizardRenderer";

// import * as React from 'react';
// import styles from './customSharePointChatBot.module.scss';
// require("./InlineCSS.css");
// import { IcustomSharePointChatBotProps } from './IcustomSharePointChatBotProps';

// import { ThemeSettingName } from 'office-ui-fabric-react';



// export interface IWorkPlaceRendererProps {
//     context?: any;
//     tenantPropertyObj?: any;




// }

export interface ISharePointChatBotProps {
    description?: string;
    context?: any;
    botinformation?: any;
    UserId?: any;
    UserDisplayName?: any;
    dropdownProperty?: any;
    headerColor?: string;
    chatColor?: string;
}


export interface ISharePointChatBotState {
    directLine: any;
    store: any;
}
// export default function Chatbot(props: IWorkPlaceRendererProps) {


//     return (
//         <div id='customHubWorkplaceRendererWrapper'>
//             <div id="customFABButton" className={styles.customFABButton}>
//                 This is chatbot own renderer

//             </div>

//         </div>
//     );
// }







export default class Chatbot extends React.Component<ISharePointChatBotProps, ISharePointChatBotState> {


    public webSpeechPonyfillFactory: Function;

    constructor(props: any) {
        super(props);

        this.state = {
            directLine: "",
            store: ""
        }
    }

    async componentDidMount() {
        let directLine = await createDirectLine({
            domain: this.props.botinformation[0]['BotDomain'],
            secret: this.props.botinformation[0]['Token'],
            webSocket: true as any
        });
        //let thisRef = this;

        var store = await createStore({}, function (_ref: any) {
            //const dispatch = _ref.dispatch;
            return function (next: any) {
                return function (action: any) {
                    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
                        console.log('store: direct line connected');
                    }
                    else
                        if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
                            // auto-scroll to the end by any incoming activity
                            // this.anim_scroll(); 
                            window.setTimeout(function () {
                                let logElem: any = document.querySelector("div[role='log'] > div");
                                if (logElem != null && typeof (logElem) != "undefined") {
                                    logElem.animate({
                                        scrollTop: logElem.getAttribute("scrollHeight") //$("div[role='log'] > div").prop("scrollHeight") // to bottom
                                    }, 200);
                                }
                            }, 300);
                        }
                        else
                            if (action.type === 'DIRECT_LINE/DISCONNECT_FULFILLED') {
                                //console.log('store: direct line disconnected');
                            }

                    return next(action);
                };
            };
        });


        if (this.props.botinformation[0]['Region'] == null || this.props.botinformation[0]['Region'] == undefined || this.props.botinformation[0]['Region'] == "") {
            if (this.props.botinformation[0]['SubscriptionKey'] == null || this.props.botinformation[0]['SubscriptionKey'] == undefined || this.props.botinformation[0]['SubscriptionKey'] == "") {
                this.webSpeechPonyfillFactory = null as any;
            }
            else {
                //   this.webSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
                //     subscriptionKey: this.props.botinformation[0]['SubscriptionKey']    
                //   });

                this.webSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
                    credentials: {
                        region: this.props.botinformation[0]['Region'],
                        subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
                    }
                });


            }
        }
        else {
            this.webSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
                credentials: {
                    region: this.props.botinformation[0]['Region'],
                    subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
                }
            });
        }

        this.setState({
            directLine: directLine,
            store: store
        });

        if (this.state.directLine != "") {
            // console.log("enter into post activity");

            var user = { id: this.props.UserId, name: this.props.UserDisplayName }
            // console.log("user details : "+user);
            // console.log("direct Line Post Activity: "+this.state.directLine);

            this.state.directLine.postActivity({
                type: "event", from: user, name: "initEvent",
                value: 'en-USs'
            })
                .subscribe((id: any) => {
                    console.log("success postactivity", id);

                    var activity: any = this.state.directLine.activity$;
                    activity.subscribe((a: any) => {
                        if (a.type == "event" && a.type == "search") {
                            this.state.directLine.postActivity({
                                type: "message", text: "showresults", value: [],
                                from: { id: this.props.UserId, name: this.props.UserDisplayName }
                            }).
                                subscribe((id: any) => { console.log("success ", id) });
                        }
                    });
                });
        }
    }

    public async SpeechEnabled() {
        if (this.props.botinformation[0]['Region'] == null || this.props.botinformation[0]['Region'] == undefined || this.props.botinformation[0]['Region'] == "") {
            //   await createCognitiveServicesSpeechServicesPonyfillFactory({
            //     subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
            //   });

            await createCognitiveServicesSpeechServicesPonyfillFactory({
                credentials: {
                    region: this.props.botinformation[0]['Region'],
                    subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
                }
            });
        }
        else {
            //   await createCognitiveServicesSpeechServicesPonyfillFactory({
            //     region: this.props.botinformation[0]['Region'],
            //     subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
            //   });

            await createCognitiveServicesSpeechServicesPonyfillFactory({
                credentials: {
                    region: this.props.botinformation[0]['Region'],
                    subscriptionKey: this.props.botinformation[0]['SubscriptionKey']
                }
            });

        }
    }

    public render(): React.ReactElement<ISharePointChatBotProps> {

        // var _isAttachmentEnabled = false;
        // var _urlAvatarImage = "";

        // if (this.props.botinformation.length > 0) {
        //     _isAttachmentEnabled = this.props.botinformation[0]['isAttachment'] == null ? false : this.props.botinformation[0]['isAttachment'];
        //     _urlAvatarImage = this.props.botinformation[0]['BotLogo'];
        // }

       
        if (this.state.directLine != "" && this.state.store != "") {
            if (this.props.botinformation.length > 0) {
                if (this.props.botinformation[0]['LongDescription'] != null) {
                    return (<div  ><div style={{ 'width': this.props.botinformation[0]['botSize'] + '%', 'height': this.props.botinformation[0]['botSize'] + '%' }}>
                        <div>
                            <div>
                                <div>
                                    <div ><div>{(this.props.botinformation[0]['LongDescription'])}</div></div>
                                    <div >
                                        <div style={{ 'backgroundColor': this.props.headerColor == null ? 'rgb(255, 255, 255)' : unescape(this.props.headerColor) }}>
                                            <div  >
                                                <img src={this.props.botinformation[0]['BotLogo']}></img>
                                            </div>
                                            <div  >
                                                <div style={{ 'fontFamily': this.props.botinformation[0]['fontfamily'], 'fontSize': this.props.botinformation[0]['fontSize'], 'color': unescape(this.props.chatColor as string) }}>{this.props.botinformation[0]['DisplayName']}</div>
                                                <div>{(this.props.botinformation[0]['SortDescription'])}</div>
                                            </div>
                                            <div >{this.props.botinformation[0]['PrivacyInfo'] == null ? <span></span> : <a href={this.props.botinformation[0]['PrivacyInfo'].Url} target="_blank">PrivacyInfo</a>}</div>
                                        </div>
                                        <div id="Chatbot">
                                            <ReactWebChat directLine={this.state.directLine} store={this.state.store}
                                           
                                                webSpeechPonyfillFactory={this.props.botinformation[0]['SubscriptionKey'] == null ||
                                                    this.props.botinformation[0]['SubscriptionKey'] == undefined || this.props.botinformation[0]['SubscriptionKey'] == "" ?
                                                    null : this.webSpeechPonyfillFactory as any}  userID={this.props.UserId}
                                                username={this.props.UserDisplayName} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div></div>);
                }
                else {
                    return (<div  >
                        <div style={{ 'width': this.props.botinformation[0]['botSize'] + '%', 'height': this.props.botinformation[0]['botSize'] + '%' }} >
                            <div  >
                                <div style={{ 'backgroundColor': this.props.headerColor == null ? '#ccc' : unescape(this.props.headerColor) }}>
                                    <div>
                                        <div  >
                                            <img src={this.props.botinformation[0]['BotLogo']}></img>
                                        </div>
                                        <div  >
                                            <div style={{ 'fontFamily': this.props.botinformation[0]['fontfamily'], 'fontSize': this.props.botinformation[0]['fontSize'], 'color': unescape(this.props.chatColor as string) }}>{this.props.botinformation[0]['DisplayName']}</div>
                                            <div>{(this.props.botinformation[0]['SortDescription'])}</div>
                                        </div>
                                        <div  >{this.props.botinformation[0]['PrivacyInfo'] == null ? <span></span> : <a href={this.props.botinformation[0]['PrivacyInfo'].Url} target="_blank">PrivacyInfo</a>}</div>
                                    </div>
                                </div>
                                <div id="customChatbot">
                                    <ReactWebChat directLine={this.state.directLine}
                                        store={this.state.store} 
                                        webSpeechPonyfillFactory={this.props.botinformation[0]['SubscriptionKey'] == null || this.props.botinformation[0]['SubscriptionKey'] == undefined ||
                                            this.props.botinformation[0]['SubscriptionKey'] == "" ? null : this.webSpeechPonyfillFactory as any} 
                                        userID={this.props.UserId} />

                                </div>
                            </div>
                        </div>
                    </div>
                    );
                }
            }
            else {
                return (<div><span>
                    <b>Chatbot has not been configured up to now, please configure it in the Web Part settings.</b>
                </span></div>)
            }
        }
        else {
            return (<div><span>Please wait loding...</span></div>)
        }
    }

    public onClick = (ev: any) => {
        ev.preventDefault();
        console.log('clicked event');
    }




    //     public render(): React.ReactElement<IcustomSharePointChatBotProps> {
    //     return (
    //         <div id='customHubWorkplaceRendererWrapper'>
    //             <div id="customFABButton" >
    //                 This is chatbot own renderer

    //             </div>

    //         </div>
    //     );
    // }
}
