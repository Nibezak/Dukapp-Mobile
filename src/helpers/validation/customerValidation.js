import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  names: Yup.string().required('customerName'),
  phone: Yup.string().required('customerPhoneRequired'),
  email: Yup.string().email('customerEmailInvalid').required('customerEmailRequired'),
  address: Yup.string().required('customerAddressRequired'),
  note: Yup.string(),
});

export default validationSchema;
