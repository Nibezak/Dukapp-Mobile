import * as yup from 'yup';
const loginValidation = yup.object().shape({
  phone: yup.number().typeError('Phone must be a number').required('Phone number is required'),
  password: yup.string().required('Password is required'),
});

export default loginValidation;
