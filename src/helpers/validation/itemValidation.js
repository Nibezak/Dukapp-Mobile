import * as Yup from 'yup';

export const normalValidationSchema = Yup.object().shape({
  name: Yup.string().required('Item name is required'),
  description: Yup.string().optional(),
  category: Yup.string().optional(),
  reOrderLevel: Yup.number()
    .min(0, 'Reorder level must be greater than or equal to 0')
    .typeError('Reorder level must be a number')
    .required('Reorder level is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .min(0, 'Quantity must be greater than or equal to 0')
    .required('Quantity is required'),
  unitPrice: Yup.number()
    .required('Cost price is required')
    .min(0, 'Cost price must be greater than or equal to 0'),
  salePrice: Yup.number()
    .required('Sale price is required')
    .min(Yup.ref('unitPrice'), 'Sale price must be greater than or equal to cost price'),
});

export const serviceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Item name is required'),
  description: Yup.string().optional(),
  category: Yup.string().optional(),
  salePrice: Yup.number()
    .required('Sale price is required')
    .typeError('Sale price must be a number')
    .min(0, 'Sale price must be greater than zero'),
});
