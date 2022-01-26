import { Button, HStack, Stack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import NextImage from 'next/image';
import LogoDark from '../../../public/logo_dark.svg';
import LogoLight from '../../../public/logo_light.svg';
import Router from 'next/router';
import { Link } from '@chakra-ui/react';

const Footer: React.FC<any> = ({ props: any }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const handleRouteSearchUser = (e: any) => {
        e.preventDefault();
        Router.push('/users/find');
    };
    return (
        <>
            <Stack
                display='flex'
                justifyContent={{
                    base: 'center',
                    md: 'space-between',
                }}
                width='full'
                direction={{
                    base: 'column',
                    md: 'row',
                }}
                alignItems='flex-start'
            >
                <HStack>
                    <NextImage
                        src={colorMode === 'light' ? LogoLight : LogoDark}
                        alt='Logo'
                        width={32}
                        height={32}
                    />
                    <Text fontWeight='bold'>© 2022 bhopmaps</Text>
                </HStack>

                <HStack spacing={4}>
                    <Button size='sm' onClick={handleRouteSearchUser}>
                        Search users
                    </Button>
                    <Link href='https://discord.gg/h4Jemkm35Q' target="_blank">
                        Join our Discord
                    </Link>
                </HStack>
            </Stack>
        </>
    );
};

export default Footer;
