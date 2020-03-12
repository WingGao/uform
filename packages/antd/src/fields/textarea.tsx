import { connect, registerFormField } from '@uform/react-schema-renderer'
import { Input } from 'antd'
import { acceptEnum, mapStyledProps, mapTextComponent } from '../shared'

const { TextArea } = Input

registerFormField(
  'textarea',
  connect({
    getProps: mapStyledProps,
    getComponent: mapTextComponent
  })(acceptEnum(TextArea))
)