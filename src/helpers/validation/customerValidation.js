import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  names: Yup.string().required('Names are required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
  address: Yup.string().required('Address is required'),
  note: Yup.string(),
});

export default validationSchema;
