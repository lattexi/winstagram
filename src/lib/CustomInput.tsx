import React from 'react';
import {TextInput, View, Text, TextInputProps} from 'react-native';
import {useColorScheme} from 'nativewind';

interface CustomInputProps extends TextInputProps {
  error?: string;
  containerClassName?: string;
  className?: string;
  errorClassName?: string;
}

const CustomInput = ({
  error,
  containerClassName = '',
  className = '',
  errorClassName = '',
  placeholderTextColor,
  multiline = false,
  autoCapitalize = 'none',
  ...props
}: CustomInputProps) => {
  const {colorScheme} = useColorScheme();
  const defaultPlaceholderColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

  return (
    <View
      className={`my-2${containerClassName} ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      <TextInput
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
        className={`text-xl border rounded-lg p-2 text-white border-gray-300 ${className} ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
        style={{lineHeight: 22}}
      />
    </View>
  );
};

export default CustomInput;
