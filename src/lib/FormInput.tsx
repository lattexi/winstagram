import {Controller} from 'react-hook-form';
import {Input} from '@rneui/themed';

interface FormInputProps {
  control: any;
  name: string;
  placeholder: string;
  rules?: object;
}

const FormInput = ({control, rules, name, placeholder}: FormInputProps) => (
  <Controller
    control={control}
    rules={rules}
    name={name}
    render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
      <Input
        className="border border-gray-300 rounded p-2"
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        autoCapitalize="none"
        errorMessage={error?.message}
      />
    )}
  />
);

export default FormInput;
