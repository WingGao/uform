import React, { createContext, useContext, createElement } from 'react'
import { Form } from 'antd'
import { useFormItem } from './context'
import { IFormItemTopProps, ICompatItemProps } from '../types'
import { normalizeCol } from '../shared'

const computeStatus = (props: ICompatItemProps) => {
  if (props.loading) {
    return 'validating'
  }
  if (props.invalid) {
    return 'error'
  }
  if (props.warnings && props.warnings.length) {
    return 'warning'
  }
  return ''
}

const computeHelp = (props: ICompatItemProps) => {
  if (props.help) return props.help
  const messages = [].concat(props.errors || [], props.warnings || [])
  return messages.length
    ? messages.map((message, index) =>
        createElement(
          'span',
          { key: index },
          message,
          messages.length - 1 > index ? ' ,' : ''
        )
      )
    : props.schema && props.schema.description
}

const computeLabel = (props: ICompatItemProps) => {
  if (props.label) return props.label
  if (props.schema && props.schema.title) {
    return props.schema.title
  }
}

const computeExtra = (props: ICompatItemProps) => {
  if (props.extra) return props.extra
}

function pickProps<T = {}>(obj: T, ...keys: (keyof T)[]): Pick<T, keyof T> {
  const result: Pick<T, keyof T> = {} as any
  for (let i = 0; i < keys.length; i++) {
    if (obj[keys[i]] !== undefined) {
      result[keys[i]] = obj[keys[i]]
    }
  }
  return result
}

const computeSchemaExtendProps = (
  props: ICompatItemProps
): IFormItemTopProps => {
  if (props.schema) {
    return pickProps(
      {
        ...props.schema.getExtendsItemProps(),
        ...props.schema.getExtendsProps()
      },
      'required',
      'className',
      'prefix',
      'labelAlign',
      'labelTextAlign',
      'size',
      'labelCol',
      'wrapperCol',
      'colon'
    )
  }
}

const FormItemPropsContext = createContext({})

export const CompatAntdFormItemProps = ({ children, ...props }) => (
  <FormItemPropsContext.Provider value={props}>
    {children}
  </FormItemPropsContext.Provider>
)

export const CompatAntdFormItem: React.FC<ICompatItemProps> = props => {
  const { prefixCls, labelAlign, labelCol, wrapperCol } = useFormItem()
  const help = computeHelp(props)
  const label = computeLabel(props)
  const status = computeStatus(props)
  const extra = computeExtra(props)
  const itemProps = computeSchemaExtendProps(props)
  const outerFormItemProps = useContext(FormItemPropsContext)
  return (
    <Form.Item
      prefixCls={prefixCls}
      label={label}
      labelCol={label ? normalizeCol(labelCol) : undefined}
      labelAlign={labelAlign}
      required={props.required}
      wrapperCol={label ? normalizeCol(wrapperCol) : undefined}
      help={help}
      validateStatus={status}
      extra={extra ? <p>{extra}</p> : undefined}
      colon={props.colon}
      className={props.className}
      {...itemProps}
      {...outerFormItemProps}
    >
      <CompatAntdFormItemProps>
        {props.beforeRender ? props.beforeRender() : false}
        {props.children}
        {props.afterRender ? props.afterRender() : false}
      </CompatAntdFormItemProps>
    </Form.Item>
  )
}