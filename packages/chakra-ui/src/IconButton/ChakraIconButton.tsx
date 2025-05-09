import { memo } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FormContextType, IconButtonProps, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

function ChakraIconButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>,
) {
  const { icon, iconType, uiSchema, registry, ...otherProps } = props;

  return (
    <IconButton aria-label={props.title!} {...otherProps}>
      {icon}
    </IconButton>
  );
}

ChakraIconButton.displayName = 'ChakraIconButton';

export default memo(ChakraIconButton) as typeof ChakraIconButton;
