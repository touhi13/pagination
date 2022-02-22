import React, { useEffect } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export interface IPost {
    title: string,
    url: string,
    created_at: Date,
    author: string
}
interface Column {
    id: 'title' | 'url' | 'created_at' | 'author',
    label: string,
    minWidth?: number,
    align?: 'right' | 'left' | 'center'
}
const columns: readonly Column[] = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'url', label: 'URL', minWidth: 170 },
    { id: 'created_at', label: 'Created At', minWidth: 170 },
    { id: 'author', label: 'Author', minWidth: 170 },
]
const Home: React.FC = () => {

    const [posts, setPosts] = React.useState<IPost[]>([]);
    const [pInterval, setPInterval] = React.useState<any>(null);
    const [page, setPage] = React.useState<number>(0);
    const [totalElements, setTotalElements] = React.useState<number>(0);
    const navigate = useNavigate();
    useEffect(() => {
        console.log('Home');
        getPosts(0);
        const interval = setInterval(() => {
            getPosts(0);
        }, 10000);
        setPInterval(interval);
        return () => {
            clearInterval(pInterval);
        }
    }, []);
    const getPosts = async (pageNumber: number) => {
        try {
            const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`);
            const data = await response.json();
            console.log(data);
            setPosts(data.hits);
            setTotalElements(data.nbHits);
        } catch (error) {
            console.log(error);
        }
    }
    const handleChangePage = async (event: unknown, newPage: number) => {
        if (newPage === 0) {
            const interval = setInterval(() => {
                getPosts(0);
            }, 10000);
            setPInterval(interval);
        } else {
            clearInterval(pInterval);
        }
        setPage(newPage);
        await getPosts(newPage);
    }
    const getDetails = (post: IPost) => {
        console.log(post);
        navigate('/details', { state: { post } });
    }
    return (
        <div>
            <Container>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                {
                                    columns.map(column =>
                                        <TableCell key={column.id} align={column.align}>
                                            {column.label}
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                posts.map((row, index) => {
                                    return (
                                        <TableRow key={index}>
                                            {
                                                columns.map(column => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.id === 'created_at' ? new Date(value).toLocaleDateString() : value}
                                                        </TableCell>
                                                    )
                                                })
                                            }
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => getDetails(row)}
                                                > View </Button>

                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={3}
                                    rowsPerPageOptions={[]}
                                    // component="div"
                                    count={totalElements}
                                    rowsPerPage={20}
                                    page={page}
                                    onPageChange={handleChangePage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default Home;