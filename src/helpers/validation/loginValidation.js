import * as yup from 'yup';
const loginValidation = yup.object().shape({
  phone: yup.number().typeError('phoneNumberType').required('phoneNumberRequired'),
  password: yup.string().required('Password is required'),
});

export default loginValidation;
