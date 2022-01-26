import React, { useContext } from 'react';
import {
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Button,
    VStack,
    Text,
    HStack,
    Link,
} from '@chakra-ui/react';
import Router from 'next/router';
import { API_URL, UserContext } from 'src/api/UserContext';
import DynamicAlert from '@/src/components/DynamicAlert';

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const [error, setError] = React.useState('');

    const { user, setUser } = useContext(UserContext);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        if (username === '' || password === '') {
            setError('Username and password are required');
            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 3000);
            return;
        }

        if (username.length < 3 || password.length < 3) {
            setError(
                'Username and password must be at least 3 characters long'
            );
            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 3000);
            return;
        }
        const authUrl = `${API_URL}/login`;
        // fetch from server
        const getToken = fetch(authUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if ((await getToken).status === 201) {
            const rawUser = await fetch(`${API_URL}/user`, {
                credentials: 'include',
            });

            const userData = await rawUser.json();

            if ((await userData).status === 401) {
                setError('Internal Server Error');
                setTimeout(() => {
                    setError('');
                    setLoading(false);
                }, 3000);
                return;
            } else {
                await setUser(userData);
                setLoading(false);
                Router.push('/');
            }
        } else {
            setError('Invalid username or password');
            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 3000);
        }
    };
    return (
        <>
            <VStack spacing={4}>
                <VStack>
                    <Heading>WELCOME BACK</Heading>
                    <Text color='gray.500'>Please enter your details</Text>
                </VStack>

                <DynamicAlert
                    status='error'
                    message={error}
                    showAlert={error ? true : false}
                />
                <DynamicAlert
                    status='success'
                    message='Successfully logged in'
                    showAlert={user ? true : false}
                />

                <FormControl isRequired>
                    <VStack spacing={4} alignItems='flex-start'>
                        <FormLabel htmlFor='username'>Username</FormLabel>
                        <Input
                            id='username'
                            type='text'
                            value={username}
                            onChange={(e) => {
                                e.preventDefault();
                                setUsername(e.target.value);
                            }}
                        />
                        <FormLabel htmlFor='password'>Password</FormLabel>
                        <Input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => {
                                e.preventDefault();
                                setPassword(e.target.value);
                            }}
                        />

                        <HStack
                            display='flex'
                            justifyContent='space-between'
                            width='stretch'
                        >
                            <Button
                                isLoading={loading}
                                colorScheme='blue'
                                type='submit'
                                onClick={handleLogin}
                            >
                                Submit
                            </Button>
                            <HStack>
                                <Text color='gray.500' fontWeight='bold'>
                                    Dont have an account?
                                </Text>
                                <Link color='blue.600' href='/auth/register'>
                                    Register now!
                                </Link>
                            </HStack>
                        </HStack>
                    </VStack>
                </FormControl>
            </VStack>
        </>
    );
};

export default Login;
