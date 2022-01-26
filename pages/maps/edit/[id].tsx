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
    Textarea,
} from '@chakra-ui/react';
import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { API_URL, UserContext } from 'src/api/UserContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useColorMode } from '@chakra-ui/react';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import lightTheme from 'react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light';
import ReactMarkdown from 'react-markdown';
import NextLink from 'next/link';
import { createDate } from 'src/utils/createDate';
import Router, { useRouter } from 'next/router';
import { HiDownload } from 'react-icons/hi';
import { formatNumber } from 'src/utils/numberFormatter';
import DynamicAlert from 'src/components/DynamicAlert';
import { NextSeo } from 'next-seo';

const Map: React.FC<{ data: any }> = ({ data }) => {
    const { map } = data;
    const { colorMode, toggleColorMode } = useColorMode();
    const { user } = useContext(UserContext);
    const [isloading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const [mapName, setMapname] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        if (mapName === '' || description === '') {
            setError('Please fill in all fields');
            setSubmitting(false);
            return;
        }

        await fetch(`${API_URL}/maps/edit/${map.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                mapName,
                description,
            }),
        }).then((res) => {
            if (res.status === 200) {
                setSuccess(true);
                setSubmitting(false);
            } else {
                setError('Something went wrong');
                setSubmitting(false);
            }

            Router.push(`/maps/${map.id}`);
        });
    };

    return (
        <>
            {map.authorId === user?.id ? (
                <></>
            ) : (
                <VStack>
                    <FormControl isRequired isDisabled={submitting}>
                        <FormLabel htmlFor='mapName'>Map Name</FormLabel>
                        <Input
                            id='mapName'
                            placeholder={map.mapName}
                            value={mapName}
                            type='text'
                            onChange={(e) => setMapname(e.target.value)}
                        />

                        <FormLabel htmlFor='description'>Description</FormLabel>
                        <Textarea
                            id='description'
                            placeholder={map.description}
                            value={description}
                            minHeight={500}
                            resize='vertical'
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Button onClick={handleSubmit}>
                            {' '}
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </FormControl>
                </VStack>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
