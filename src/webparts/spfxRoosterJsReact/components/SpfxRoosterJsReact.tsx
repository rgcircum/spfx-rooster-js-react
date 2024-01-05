import * as React from 'react';
import { FC, useRef } from 'react';

// SPFx
import { DisplayMode } from '@microsoft/sp-core-library';

// Fluent UI
import { css } from '@fluentui/react/lib/Utilities';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';

// Rooster JS
import { Rooster, Ribbon, RibbonButton, createEmojiPlugin, createRibbonPlugin, AllButtonStringKeys, getButtons, createUpdateContentPlugin, UpdateMode, RibbonPlugin, createContextMenuPlugin, createTableEditMenuProvider, createListEditMenuProvider, createImageEditMenuProvider } from 'roosterjs-react';
import { ContextMenu, ImageEdit } from 'roosterjs-editor-plugins';
import { EditorPlugin } from 'roosterjs-editor-types';

// Components
import type { ISpfxRoosterJsReactProps } from './ISpfxRoosterJsReactProps';

type RibbonStringKeys =
  | AllButtonStringKeys

const SpfxRoosterJsReact: FC<ISpfxRoosterJsReactProps> = (props) => {

  const {
    displayMode,
    richText,
    theme,
    onRichTextChange
  } = props;

  const _ribbonPlugin = useRef<RibbonPlugin>(createRibbonPlugin());

  const _mainWindowButtons = useRef<RibbonButton<RibbonStringKeys>[]>(getButtons());

  const _updateContentPlugin = useRef(createUpdateContentPlugin(UpdateMode.OnUserInput, (content) => {
    onRichTextChange(content);
  }));

  const _getPlugins = (): (EditorPlugin | ContextMenu<IContextualMenuItem>)[] => {

    const imageEdit = new ImageEdit({ preserveRatio: false });
    const plugins = [
      _updateContentPlugin.current,
      createContextMenuPlugin(),
      createTableEditMenuProvider(),
      createListEditMenuProvider(),
      createImageEditMenuProvider(imageEdit),
      createEmojiPlugin(),
      _ribbonPlugin.current
    ]

    return plugins;
  };

  return (
    <div
      className={css(
        'rte-webpart',
        'rte--ck5',
        'rte--read-ck5',
        'uniformSpacingForElements',
      )}
    >
      {displayMode === DisplayMode.Read ?
        <div className='ck-content rteEmphasis' dangerouslySetInnerHTML={{ __html: richText }} />
        :
        <>
          <Ribbon
            buttons={_mainWindowButtons.current}
            plugin={_ribbonPlugin.current}
          />
          {
            <Rooster
              className='ck-content rteEmphasis'
              plugins={_getPlugins()}
              defaultFormat={{
                backgroundColors : {
                  darkModeColor : theme.palette.black,
                  lightModeColor :  theme.palette.white,
                },                
                fontSize: '18px',
                textColor: theme.palette.black,
                backgroundColor: 'transparent'
              }}
              initialContent={richText}
            />
          }
        </>
      }
    </div>
  );
}

export default SpfxRoosterJsReact;

