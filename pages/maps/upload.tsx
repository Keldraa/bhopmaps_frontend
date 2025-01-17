import DynamicAlert from '@/src/components/DynamicAlert';
import {
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    Text,
    HStack,
    Button,
    Link,
    RadioGroup,
    Stack,
    Radio,
} from '@chakra-ui/react';
import Router from 'next/router';
import React from 'react';
import { API_URL, UserContext } from 'src/api/UserContext';

const Upload = () => {
    const [mapName, setMapname] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState('');
    const [gameType, setGameType] = React.useState('CSS');
    const [success, setSuccess] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    // Handling File input
    const fileInput: any = React.useRef();
    const maxFileSize = 100000000;

    const thumbnailInput: any = React.useRef();
    const maxThumbnailSize = 5000000;

    const zipFileTypes = ['application/zip', 'application/x-zip-compressed'];

    const { user } = React.useContext(UserContext);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        if (mapName === '' || description === '') {
            setError('Please fill in all fields');
            setSubmitting(false);
            return;
        }

        if (fileInput.current.files[0].size > maxFileSize) {
            setError('File size is too big');
            setSubmitting(false);
            return;
        }

        if (thumbnailInput.current.files[0].size > maxThumbnailSize) {
            setError('File size is too big for thumbnail');
            setSubmitting(false);
            return;
        }

        if (!zipFileTypes.includes(fileInput.current.files[0].type)) {
            setError('File type is not supported');
            setSubmitting(false);

            return;
        }

        if (thumbnailInput.current.files[0].type !== 'image/png') {
            setError('File type is not png');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('mapName', mapName);
        formData.append('description', description);
        formData.append('thumbnail', thumbnailInput.current.files![0]);
        formData.append('file', fileInput.current.files![0]);
        formData.append('gameType', gameType);

        try {
            fetch(`${API_URL}/map/new`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }).then((res) => {
                if (description.length > 3000) {
                    setError('Description must be less than 3000 characters');
                    setSubmitting(false);
                    setTimeout(() => {
                        setError('');
                    }, 2000);

                    return;
                }
                if (res.status === 400) {
                    setError(res.statusText);
                    setSubmitting(false);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                } else if (res.status === 401) {
                    setError(res.statusText);
                    setSubmitting(false);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                } else {
                    setSuccess(true);

                    setTimeout(() => {
                        setSubmitting(false);
                        Router.push('/');
                    }, 2000);
                }
            });
        } catch (e) {
            return;
        }
    };

    return (
        <>
            {user ? (
                <FormControl isRequired>
                    <VStack alignItems='flex-start' spacing={4}>
                        <FormLabel htmlFor='mapName'>Map name</FormLabel>
                        <Input
                            isDisabled={submitting}
                            id='username'
                            type='text'
                            value={mapName}
                            onChange={(e) => setMapname(e.target.value)}
                        />

                        <FormLabel htmlFor='thumbnail'>
                            Choose thumbnail
                        </FormLabel>
                        <Input
                            isDisabled={submitting}
                            id='thumbnail'
                            type='file'
                            ref={thumbnailInput}
                            variant='unstyled'
                            accept='image/png'
                        />
                        <Text fontSize='xs'>Supported file types: .png</Text>

                        <HStack justifyContent='space-between' w='full'>
                            <FormLabel htmlFor='description'>
                                Description
                            </FormLabel>
                            <Link
                                href='https://www.markdownguide.org/basic-syntax/'
                                fontSize={11}
                                color='gray.500'
                            >
                                MARKDOWN SUPPORTED
                            </Link>
                        </HStack>
                        <Textarea
                            id='description'
                            isDisabled={submitting}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            size='sm'
                            resize='vertical'
                            height={300}
                            maxHeight={400}
                        />
                        <Text fontSize='sm' color='gray.500'>
                            {description.length} / 3000{' '}
                        </Text>

                        <FormLabel htmlFor='file'>Choose file</FormLabel>
                        <Input
                            isDisabled={submitting}
                            className='file-input'
                            id='file'
                            type='file'
                            ref={fileInput}
                            variant='unstyled'
                            accept={zipFileTypes.join(',')}
                        />
                        <Text fontSize='xs'>Supported file types: .zip</Text>
                        <FormLabel htmlFor='gameType'>Choose game</FormLabel>
                        <RadioGroup
                            isDisabled={submitting}
                            onChange={setGameType}
                            value={gameType}
                        >
                            <Stack direction='row'>
                                <Radio value='CSS'>CSS</Radio>
                                <Radio value='CSGO'>CSGO</Radio>
                            </Stack>
                        </RadioGroup>
                        <Button
                            isLoading={submitting}
                            type='submit'
                            colorScheme='blue'
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>

                        <DynamicAlert
                            status='error'
                            message={error}
                            showAlert={error != '' ? true : false}
                        />
                        <DynamicAlert
                            status='success'
                            message='Map uploaded'
                            showAlert={success ? true : false}
                        />
                    </VStack>
                </FormControl>
            ) : (
                <VStack>
                    <Text>You need to be logged in to upload maps</Text>
                    <Link color='blue.600' href='/auth/login'>
                        Login now to upload maps!
                    </Link>
                </VStack>
            )}
        </>
    );
};

export default Upload;
