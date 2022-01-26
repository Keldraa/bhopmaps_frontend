import {
    VStack,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Heading,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { API_URL, UserContext } from 'src/api/UserContext';
import Router from 'next/router';
import DynamicAlert from 'src/components/DynamicAlert';

const Map: React.FC<{ data: any }> = ({ data }) => {
    const { map } = data;
    const { user } = useContext(UserContext);
    const [error, setError] = React.useState('');

    const [mapName, setMapname] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        if (mapName === '') {
            setMapname(map.mapName);
        }

        if (mapName.trim().length < 5) {
            setError('Map name must be at least 5 characters');

            setTimeout(() => {
                setError('');
            }, 3000);

            setSubmitting(false);
            return;
        }

        if (description.trim().length < 10) {
            setError('Description must be at least 10 characters');
            setDescription(map.description);
        }

        await fetch(`${API_URL}/map/${map.id}/update`, {
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
                <VStack spacing={4} alignItems='flex-start'>
                    <Heading>Edit {map.mapName}</Heading>
                    <FormControl isRequired isDisabled={submitting}>
                        <VStack spacing={4} alignItems='flex-start'>
                            <FormLabel htmlFor='mapName'>Map Name</FormLabel>
                            <Input
                                id='mapName'
                                placeholder={map.mapName}
                                value={mapName}
                                type='text'
                                onChange={(e) => setMapname(e.target.value)}
                            />

                            <FormLabel htmlFor='description'>
                                Description
                            </FormLabel>
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
                        </VStack>
                    </FormControl>
                    <DynamicAlert
                        status='error'
                        message={error}
                        showAlert={error ? true : false}
                    />
                </VStack>
            ) : (
                <Text>You are not the author of this map</Text>
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
