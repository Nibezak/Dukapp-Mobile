import * as yup from 'yup';
const loginValidation = yup.object().shape({
  phone: yup.number().typeError('phoneNumberType').required('phoneNumberRequired'),
});

export default loginValidation;
