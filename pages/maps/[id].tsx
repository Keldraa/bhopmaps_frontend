import {
    VStack,
    Heading,
    Text,
    Image,
    Button,
    Link,
    Box,
    HStack,
    Tag,
    TagLabel,
    TagRightIcon,
    Stack,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Avatar,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { API_URL, UserContext } from 'src/api/UserContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useColorMode } from '@chakra-ui/react';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import lightTheme from 'react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light';
import ReactMarkdown from 'react-markdown';
import NextLink from 'next/link';
import { createDate } from 'src/utils/createDate';
import Router from 'next/router';
import { HiDownload } from 'react-icons/hi';
import { formatNumber } from 'src/utils/numberFormatter';
import DynamicAlert from '../../src/components/DynamicAlert';
import { NextSeo } from 'next-seo';

const Map: React.FC<{ data: any; userFetched: any }> = ({
    data,
    userFetched,
}) => {
    const { map } = data;

    const { userData } = userFetched;
    const { colorMode, toggleColorMode } = useColorMode();
    const { user } = useContext(UserContext);
    const [isloading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const renderers = {
        code: (props: any) => {
            return (
                <SyntaxHighlighter
                    customStyle={{
                        fontSize: '16px',
                        borderRadius: '8px',
                        padding: '8px',
                        margin: '2rem 0',
                    }}
                    style={colorMode === 'light' ? lightTheme : darkTheme}
                    language={props.className?.replace('language-', '')}
                    // eslint-disable-next-line react/no-children-prop
                    children={props.children}
                />
            );
        },
        h1: (props: any) => <Heading as='h1' size='lg' {...props} />,
        h2: (props: any) => <Heading as='h2' size='md' {...props} />,
        h3: (props: any) => <Heading as='h3' size='sm' {...props} />,
        a: (props: any) => (
            <Button colorScheme='yellow' as='a' size='xs' my={2} {...props} />
        ),
    };

    const handleDownload = async () => {
        setLoading(true);
        const res = await fetch(`${API_URL}/map/${map.id}/download`, {
            method: 'PUT',
        });

        const downloadUrl = await res.json();
        Router.push(downloadUrl.url);
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        const res = await fetch(`${API_URL}/map/${map.id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            setLoading(false);
            Router.push(`/user/${user.username}`);
        });

        return {
            message: 'Successfully deleted map',
        };
    };

    return (
        <>
            <NextSeo
                title={`${map.mapName} - Bunnyhop Map (${map.gameType})`}
                description={`Published by ${map.author} on ${createDate(
                    map.createdAt
                )}`}
                openGraph={{
                    title: `${map.mapName} - Bunnyhop Map (${map.gameType})`,
                    description: `Published by ${map.author} on ${createDate(
                        map.createdAt
                    )}`,
                    images: [
                        {
                            url: `${map.thumbnail}`,
                        },
                    ],
                    site_name: 'www.bhopmaps.app',
                }}
            />
            {data.statusCode != 400 ? (
                <Box alignItems='flex-start'>
                    <VStack alignItems='flex-start'>
                        <Stack
                            display='flex'
                            justifyContent={{
                                base: 'flex-start',
                                md: 'space-between',
                            }}
                            width='full'
                            direction={{
                                base: 'column',
                                md: 'row',
                            }}
                            alignItems='flex-start'
                        >
                            <HStack justifyContent='center' spacing={4}>
                                <VStack alignItems='flex-start'>
                                    <Stack
                                        justifyContent={{
                                            base: 'flex-start',
                                            md: 'space-between',
                                        }}
                                        direction={{
                                            base: 'column',
                                            md: 'row',
                                        }}
                                        w='md'
                                    >
                                        <Heading>{map.mapName}</Heading>
                                        <HStack>
                                            <NextLink href='/' passHref>
                                                <Button
                                                    size='sm'
                                                    variant='solid'
                                                >
                                                    Back
                                                </Button>
                                            </NextLink>
                                        </HStack>
                                    </Stack>
                                    <VStack alignItems='flex-start'>
                                        <HStack>
                                            <Text color='gray.500'>
                                                Published on
                                            </Text>

                                            <Text
                                                color='gray.500'
                                                fontWeight='bold'
                                            >
                                                {createDate(map.createdAt)}
                                            </Text>
                                            <HStack>
                                                <Avatar
                                                    size='xs'
                                                    src={userData?.avatar}
                                                />
                                                <Link
                                                    fontWeight='bold'
                                                    color='blue.600'
                                                    href={`/user/${map.author}`}
                                                >
                                                    {' '}
                                                    {map.author}
                                                </Link>
                                            </HStack>
                                        </HStack>
                                        {map.authorId === user?.id ? (
                                            <HStack>
                                                <Button
                                                    size='sm'
                                                    isLoading={isloading}
                                                    colorScheme='red'
                                                    onClick={handleDelete}
                                                >
                                                    Delete Map
                                                </Button>
                                                <Link
                                                    fontSize='sm'
                                                    color='gray.500'
                                                    href={`/maps/edit/${map.id}`}
                                                >
                                                    Edit Map
                                                </Link>
                                            </HStack>
                                        ) : (
                                            <></>
                                        )}
                                    </VStack>
                                    <HStack>
                                        <Tag colorScheme='cyan'>
                                            <TagLabel>
                                                {formatNumber(map.downloads)}
                                            </TagLabel>
                                            <TagRightIcon
                                                boxSize='12px'
                                                as={HiDownload}
                                            />
                                        </Tag>
                                        {map.gameType === 'CSS' ? (
                                            <Tag colorScheme='green'>
                                                {map.gameType}
                                            </Tag>
                                        ) : (
                                            <Tag colorScheme='blue'>
                                                {map.gameType}
                                            </Tag>
                                        )}
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Stack>
                        <VStack alignItems='flex-start'>
                            <Image
                                src={map.thumbnail}
                                alt='Map thumbnail'
                                width='lg'
                                rounded='lg'
                            />
                        </VStack>
                    </VStack>
                    <VStack
                        alignItems='flex-start'
                        spacing={8}
                        mt='20'
                        width='100%'
                    >
                        <Heading size='md' color='gray.500'>
                            Description
                        </Heading>
                        <Divider />
                        <Box>
                            <ReactMarkdown
                                skipHtml={false}
                                // eslint-disable-next-line react/no-children-prop
                                children={map.description}
                                components={renderers}
                            />
                        </Box>
                        <HStack>
                            <Button
                                isLoading={isloading}
                                colorScheme='blue'
                                onClick={handleDownload}
                            >
                                Download map
                            </Button>
                        </HStack>

                        <DynamicAlert
                            status='error'
                            message={error}
                            showAlert={error ? true : false}
                        />
                    </VStack>
                </Box>
            ) : (
                <Text>Map not found</Text>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    params,
    res,
}) => {
    const { id }: any = params;
    const result = await fetch(`${API_URL}/map/${id}`);
    const data: any = await result.json();

    const resultUser = await fetch(`${API_URL}/user/${data.map.author}`);

    const userFetched = await resultUser.json();
    return {
        props: {
            data,
            userFetched,
        },
    };
};

export default Map;
