import * as Yup from 'yup';

export const normalValidationSchema = Yup.object().shape({
  name: Yup.string().required('itemName'),
  description: Yup.string().optional(),
  category: Yup.string().optional(),
  reOrderLevel: Yup.number()
    .min(0, 'itemReorderLevel')
    .typeError('itemReorderLevelType')
    .required('itemReorderLevelRequired'),
  quantity: Yup.number()
    .typeError('itemQuantityType')
    .min(1, 'itemQuantity')
    .required('itemQuantityRequired'),
  unitPrice: Yup.number().required('itemUnitPriceRequired').min(1, 'itemUnitPrice'),
  salePrice: Yup.number()
    .required('itemSalePriceRequired')
    .min(Yup.ref('unitPrice'), 'itemSalePrice'),
});

export const serviceValidationSchema = Yup.object().shape({
  name: Yup.string().required('itemName'),
  description: Yup.string().optional(),
  category: Yup.string().optional(),
  salePrice: Yup.number()
    .required('itemSalePriceRequired')
    .typeError('itemSalePriceType')
    .min(1, 'itemSalePriceMin'),
});
