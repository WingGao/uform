import React, { useMemo, useState } from 'react'
import { Form, Spin } from 'antd'
import { FormProps } from 'antd/lib/form'
import { LifeCycleTypes, IFormItemTopProps, useFormEffects } from '../types'
import { FormItemDeepProvider } from '../context'
import { normalizeCol, isAntdV4 } from '../shared'
import {
  PreviewText,
  PreviewTextConfigProps
} from '@formily/react-shared-components'

export const AntdSchemaFormAdaptor: React.FC<FormProps &
  IFormItemTopProps &
  PreviewTextConfigProps & { onSubmit: () => void }> = props => {
  const { inline, previewPlaceholder, onSubmit, onReset, ...rest } = props
  const [loading, setLoading] = useState(false)
  useFormEffects(($) => {
    $(LifeCycleTypes.ON_FORM_CHANGE).subscribe(fs => {
      setLoading(fs.loading)
    })
  })
  return (
    <FormItemDeepProvider {...props}>
      <PreviewText.ConfigProvider value={props}>
        <Spin spinning={loading}>
          <Form
            {...rest}
            labelCol={normalizeCol(props.labelCol)}
            wrapperCol={normalizeCol(props.wrapperCol)}
            layout={inline ? 'inline' : props.layout}
            onSubmit={onSubmit}
            onReset={onReset}
            component={useMemo(() => {
              if (isAntdV4) {
                return innerProps => {
                  return React.createElement('form', {
                    ...innerProps,
                    onSubmit,
                    onReset
                  })
                }
              }
            }, [])}
          />
        </Spin>
      </PreviewText.ConfigProvider>
    </FormItemDeepProvider>
  )
}
