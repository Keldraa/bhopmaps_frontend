import {
    VStack,
    Heading,
    Text,
    Image,
    Button,
    Link,
    Box,
    Divider,
    HStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { API_URL } from 'src/api/UserContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useColorMode } from '@chakra-ui/react';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import lightTheme from 'react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light';
import ReactMarkdown from 'react-markdown';

const Map: React.FC<{ data: any }> = ({ data }) => {
    const { map } = data;
    const { colorMode, toggleColorMode } = useColorMode();

    const renderers = {
        code: (props: any) => {
            return (
                <SyntaxHighlighter
                    customStyle={{
                        fontSize: '16px',
                        borderRadius: '10px',
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
        a: (props: any) => <Link as='a' size='sm' my={2} {...props} />,
    };
    const handleDownload = async () => {
        // TODO: Download the map
    };

    return (
        <>
            {data.statusCode != 400 ? (
                <VStack spacing={8} alignItems='flex-start'>
                    <VStack alignItems='flex-start'>
                        <Heading>{map.mapName}</Heading>
                        <HStack>
                            <Text color='gray.500'>by</Text>
                            <Link color='blue.600' href={`/user/${map.author}`}>
                                {' '}
                                {map.author}
                            </Link>
                        </HStack>
                        <Image
                            src={map.thumbnail}
                            alt='Map thumbnail'
                            width={80}
                            rounded='md'
                        />
                    </VStack>
                    <Divider />
                    <VStack alignItems='flex-start' spacing={8} width='100%'>
                        <Heading size='md'>Description</Heading>
                        <Box>
                            <ReactMarkdown
                                skipHtml={false}
                                // eslint-disable-next-line react/no-children-prop
                                children={map.description}
                                components={renderers}
                            />
                        </Box>
                        <Button colorScheme='blue' onClick={handleDownload}>
                            Download
                        </Button>
                    </VStack>
                </VStack>
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

    return {
        props: {
            data,
        },
    };
};

export default Map;
