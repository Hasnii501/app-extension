import { Log } from '@microsoft/sp-core-library';
import Chatbot from "./Chatbot";
// import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {
   PlaceholderContent,PlaceholderName
} from '@microsoft/sp-application-base';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ChatbotTestApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ChatbotTestApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IChatbotTestApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ChatbotTestApplicationCustomizer
  extends BaseApplicationCustomizer<IChatbotTestApplicationCustomizerProperties> {
    private _bottomPlaceholder: PlaceholderContent | undefined;
  
  
    private _onDispose(): void {
      console.log('[ChatbotExtensionApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }
  
    public onInit(): Promise<void> {

 
      let ctx = this.context;
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`).catch(() => {
      /* handle error */
    });

    if (this._bottomPlaceholder != undefined) {
      this._bottomPlaceholder = ctx.placeholderProvider.tryCreateContent(
        PlaceholderName.Top, { onDispose: this._onDispose }
      );
      { <Chatbot/> }
      // ReactDOM.render(<div style={{ position: "absolute", bottom: "1%", right: "25px", zIndex: 999999 }}>
      //   { <Chatbot/> }
      // </div>, this._bottomPlaceholder.domElement);

    }

    return Promise.resolve();
  }
}
