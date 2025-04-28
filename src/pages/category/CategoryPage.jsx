import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect, useState } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Rating,
  Box,
  Grid,
  Container
} from "@mui/material";
import { AddShoppingCart, RemoveShoppingCart, Star } from "@mui/icons-material";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

const CategoryPage = () => {
    const { categoryname } = useParams();
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const getAllProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(fireDB, "products"));
            const allProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(allProducts);
            const filtered = allProducts.filter(product => 
                product.category.includes(categoryname)
            );
            setFilteredProducts(filtered);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllProducts();
    }, [categoryname]);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success(`${item.title} added to cart`);
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success(`${item.title} removed from cart`);
    };

    return (
        <Layout>
            <Box sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                minHeight: '100vh',
                py: 8,
                px: { xs: 2, sm: 4, md: 6 }
            }}>
                {/* Category Header */}
                <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="h3" 
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 2,
                            textTransform: 'capitalize',
                            background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {categoryname}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Premium {categoryname} collection
                    </Typography>
                </Container>

                {/* Products Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <Loader />
                    </Box>
                ) : (
                    <Container maxWidth="lg">
                        {filteredProducts.length > 0 ? (
                            <Grid container spacing={4}>
                                {filteredProducts.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <Card sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(40, 40, 40, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '16px',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                                            }
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={item.productImageUrl}
                                                alt={item.title}
                                                sx={{
                                                    cursor: 'pointer',
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: '16px',
                                                    borderTopRightRadius: '16px'
                                                }}
                                                onClick={() => navigate(`/productinfo/${item.id}`)}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Rating
                                                        value={item.rating || 4.5}
                                                        precision={0.5}
                                                        readOnly
                                                        icon={<Star sx={{ color: '#ffc107' }} />}
                                                        emptyIcon={<Star sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                                                    />
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                                                        ({item.reviews || 24})
                                                    </Typography>
                                                </Box>
                                                <Typography 
                                                    gutterBottom 
                                                    variant="h6" 
                                                    component="div" 
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        mb: 2,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                                            रु{item.price}
                                                        </Typography>
                                                        {item.oldPrice && (
                                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                                                                रु{item.oldPrice}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Chip 
                                                        label={item.category[0]}
                                                        sx={{
                                                            backgroundColor: 'rgba(30, 136, 229, 0.2)',
                                                            color: '#1e88e5',
                                                            fontWeight: 600,
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                </Box>
                                                {cartItems.some((p) => p.id === item.id) ? (
                                                    <Button
                                                        fullWidth
                                                        startIcon={<RemoveShoppingCart />}
                                                        onClick={() => deleteCart(item)}
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: '#d32f2f',
                                                            color: 'white',
                                                            borderRadius: '12px',
                                                            py: 1.5,
                                                            '&:hover': {
                                                                backgroundColor: '#b71c1c'
                                                            }
                                                        }}
                                                    >
                                                        Remove from Cart
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        fullWidth
                                                        startIcon={<AddShoppingCart />}
                                                        onClick={() => addCart(item)}
                                                        variant="contained"
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                                            color: 'white',
                                                            borderRadius: '12px',
                                                            py: 1.5,
                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                            '&:hover': {
                                                                boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                py: 10,
                                textAlign: 'center'
                            }}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                                    alt="No products"
                                    style={{ width: '120px', height: '120px', opacity: 0.7, marginBottom: '24px' }}
                                />
                                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                                    No {categoryname} products found
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                    We couldn't find any products in this category
                                </Typography>
                                <Button 
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        '&:hover': {
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            backgroundColor: 'rgba(255,255,255,0.05)'
                                        }
                                    }}
                                    onClick={() => navigate('/')}
                                >
                                    Back to Home
                                </Button>
                            </Box>
                        )}
                    </Container>
                )}
            </Box>
        </Layout>
    );
};

export default CategoryPage;