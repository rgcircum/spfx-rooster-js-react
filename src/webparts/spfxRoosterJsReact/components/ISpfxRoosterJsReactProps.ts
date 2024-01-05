import { ITheme } from '@fluentui/react/lib/Theme';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface ISpfxRoosterJsReactProps {
  displayMode: DisplayMode;
  theme: ITheme;
  richText: string;  
  onRichTextChange: (text: string) => void;
}
