import React from 'react';
import {
    Heading,
    Text,
    VStack,
    Image,
    HStack,
    InputGroup,
    Input,
    InputLeftElement,
    Icon,
    Divider,
    useColorModeValue,
    useColorMode,
    Stack,
    List,
    ListItem,
} from '@chakra-ui/react';
import { API_URL, UserContext } from 'src/api/UserContext';
import { GetServerSideProps } from 'next';
import fetch from 'node-fetch';
import { HiOutlineSearch } from 'react-icons/hi';
import config from '../../config.json';
import NextLink from 'next/link';

type Map = {
    id: string;
    author: string;
    authorId: string;
    mapName: string;
    thumbnail: string;
    description: string;
    download: string;
    createdAt: Date;
    updatedAt: Date;
};

const Profile: React.FC<{ data: any; maps: any }> = ({ data, maps }) => {
    const joined = new Date(data.userData?.createdAt).toLocaleDateString(
        'en-US',
        {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    );

    const cardBackground = useColorModeValue('gray.50', 'gray.800');
    const hoverBg = useColorModeValue('gray.200', 'gray.700');
    const { colorMode, toggleColorMode } = useColorMode();

    const createDate = (date: Date) => {
        const dateObj = new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return dateObj;
    };
    // Filtering
    const [searchByTitle, setSearchByTitle] = React.useState('');

    const handleSearchByTitle = (e: any) => {
        e.preventDefault();
        setSearchByTitle(e.target.value);
    };
    return (
        <>
            {data.statusCode != 400 ? (
                <>
                    <VStack spacing={8} alignItems='flex-start'>
                        <VStack alignItems='flex-start'>
                            <Image
                                borderRadius={12}
                                src={
                                    data.userData?.avatar
                                        ? data.userData?.avatar
                                        : config.defaultAvatar
                                }
                                boxSize={48}
                                alt='Avatar'
                                loading='eager'
                            />
                            <Heading>{data.userData?.username}</Heading>
                            <HStack>
                                <Text color='gray.500'>Registered since:</Text>
                                <Text fontWeight='bold' color='gray.500'>
                                    {' '}
                                    {joined}
                                </Text>
                            </HStack>
                        </VStack>
                        <Divider />
                        <HStack w='full'>
                            <InputGroup size='md'>
                                <Input
                                    placeholder={config.searchTextPlaceHolder}
                                    value={searchByTitle}
                                    onChange={handleSearchByTitle}
                                    rounded='md'
                                    variant='filled'
                                />
                                <InputLeftElement>
                                    <Icon
                                        as={HiOutlineSearch}
                                        w={6}
                                        h={6}
                                        color='gray.600'
                                    />
                                </InputLeftElement>
                            </InputGroup>
                        </HStack>
                    </VStack>
                    <List spacing={6}>
                        {maps
                            .filter((maps: any) =>
                                maps.mapName
                                    .toLowerCase()
                                    .includes(searchByTitle.toLowerCase())
                            )
                            .sort((a: any, b: any) => {
                                const aDate = new Date(a.createdAt);
                                const bDate = new Date(b.createdAt);
                                return bDate.getTime() - aDate.getTime();
                            })
                            .map((map: Map) => (
                                <>
                                    <ListItem key={map.id}>
                                        <NextLink href={`/map/${map.id}`}>
                                            <VStack
                                                bg={cardBackground}
                                                w='full'
                                                p={{ base: 4, md: 6 }}
                                                rounded='md'
                                                alignItems='stretch'
                                                transitionProperty='all'
                                                transitionDuration='slow'
                                                transitionTimingFunction='ease-out'
                                                _hover={{
                                                    bg: hoverBg,
                                                    transform:
                                                        'scale(1.025, 1.025)',
                                                }}
                                                cursor='pointer'
                                            >
                                                <Stack
                                                    w='full'
                                                    justifyContent='space-between'
                                                    direction={{
                                                        base: 'column',
                                                        md: 'row',
                                                    }}
                                                >
                                                    <HStack
                                                        justifyContent='space-between'
                                                        width='stretch'
                                                    >
                                                        <VStack alignItems='flex-start'>
                                                            <Heading
                                                                size='md'
                                                                color={
                                                                    colorMode ===
                                                                    'light'
                                                                        ? 'gray.700'
                                                                        : 'white'
                                                                }
                                                            >
                                                                {map.mapName}
                                                            </Heading>
                                                            <Text color='gray.500'>
                                                                by {map.author}
                                                            </Text>
                                                        </VStack>

                                                        <VStack alignItems='flex-end'>
                                                            <Image
                                                                src={
                                                                    map.thumbnail
                                                                }
                                                                alt='Map thumbnail'
                                                                rounded='md'
                                                                width={20}
                                                            />

                                                            <Text>
                                                                {createDate(
                                                                    map.createdAt
                                                                )}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </Stack>
                                            </VStack>
                                        </NextLink>
                                    </ListItem>
                                </>
                            ))}
                    </List>
                </>
            ) : (
                <Heading size='md'>{data.message}</Heading>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    params,
    res,
}) => {
    const { username }: any = params;
    const result = await fetch(`${API_URL}/user/${username}`);
    const data: any = await result.json();

    const mapsResult = await fetch(
        `${API_URL}/map/author/${data.userData?.id}`
    );

    const maps: any = await mapsResult.json();

    return {
        props: {
            data,
            maps,
        },
    };
};
export default Profile;