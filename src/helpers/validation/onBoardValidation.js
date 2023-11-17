import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('name'),
  address: Yup.string().optional(),
  email: Yup.string().email('emailInvalid').required('email'),
  businessName: Yup.string().required('businessName'),
  tin: Yup.number().optional(),
});
