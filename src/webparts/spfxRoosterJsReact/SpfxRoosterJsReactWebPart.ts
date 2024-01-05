import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme, ThemeChangedEventArgs, ThemeProvider } from '@microsoft/sp-component-base';

import SpfxRoosterJsReact from './components/SpfxRoosterJsReact';
import { ISpfxRoosterJsReactProps } from './components/ISpfxRoosterJsReactProps';
import { ITheme } from '@fluentui/react/lib/Theme';

export interface ISpfxRoosterJsReactWebPartProps {
  richText: string;
}

export default class SpfxRoosterJsReactWebPart extends BaseClientSideWebPart<ISpfxRoosterJsReactWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  protected async onInit(): Promise<void> {

    await super.onInit();

    this.context.serviceScope.whenFinished(() => {

      // Theme
      this._themeProvider = this.context.serviceScope.consume(
        ThemeProvider.serviceKey
      );
      this._themeVariant = this._themeProvider.tryGetTheme();
      this._themeProvider.themeChangedEvent.add(
        this,
        this._handleThemeChangedEvent
      );
    });

    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<ISpfxRoosterJsReactProps> = React.createElement(
      SpfxRoosterJsReact,
      {
        theme: this._themeVariant as ITheme,
        displayMode: this.displayMode,
        richText: this.properties.richText,
        onRichTextChange: (text: string) => { this.properties.richText = text }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme as ITheme;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
