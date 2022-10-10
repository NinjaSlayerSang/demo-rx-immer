import { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { Input } from 'antd';

const JSONTextArea: FunctionComponent<{
  style?: CSSProperties;
  defaultValue: any;
  onChange: (obj: any) => void;
}> = (props) => {
  const { style, defaultValue, onChange } = props;
  const defaultValueText = JSON.stringify(defaultValue, undefined, 4);

  const [text, setText] = useState('');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setText(defaultValueText);
  }, [defaultValueText]);

  useEffect(() => {
    try {
      const obj = JSON.parse(text);
      setValid(true);
      onChange(obj);
    } catch (error) {
      setValid(false);
    }
  }, [text]);

  return (
    <Input.TextArea
      style={{ ...style, ...(valid ? {} : { borderColor: 'red' }) }}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
      }}
    />
  );
};

export default JSONTextArea;
