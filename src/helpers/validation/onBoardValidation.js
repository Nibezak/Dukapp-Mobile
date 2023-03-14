import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().optional(),
  email: Yup.string().email('Email is invalid').required('Email is required'),
  businessName: Yup.string().required('Business name is required'),
  tin: Yup.number().optional(),
});
