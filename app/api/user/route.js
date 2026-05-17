import jwt from 'jsonwebtoken';

// Demo user data
const demoUser = {
  _id: 'demo1',
  name: 'Rahul Kumar',
  email: 'rahul@demo.com',
  phone: '+91 98765 43210',
  workType: 'delivery',
  flexScore: 750,
  vaultBalance: 25000,
  creditLimit: 50000,
  totalSavings: 15000,
  platforms: [
    {
      name: 'Zomato',
      rating: 4.5,
      joinedDate: '2024-01-15'
    },
    {
      name: 'Swiggy',
      rating: 4.3,
      joinedDate: '2024-02-20'
    }
  ],
  createdAt: '2024-01-01T00:00:00Z',
  isDemo: true
};

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header found');
      return Response.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    console.log('🔍 Verifying token in /api/user:', token.substring(0, 20) + '...');
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not defined!');
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }
    
    console.log('🔑 JWT_SECRET found:', process.env.JWT_SECRET ? 'YES' : 'NO');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token decoded in /api/user:', decoded);
    
    // For demo user, return demo data
    if (decoded.isDemo && decoded.userId === 'demo1') {
      console.log('✅ Returning demo user data');
      return Response.json({ 
        success: true, 
        data: demoUser 
      });
    }
    
    // For real users, you would fetch from database
    // const user = await getUserFromDatabase(decoded.userId);
    
    return Response.json({ 
      success: false, 
      error: 'User not found' 
    }, { status: 404 });
    
  } catch (error) {
    console.error('❌ Auth error in /api/user:', error);
    return Response.json({ 
      success: false, 
      error: 'Invalid token' 
    }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not defined in PUT!');
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await request.json();
    
    console.log('🔄 Updating user:', decoded.userId, body);
    
    // For demo user, return updated demo data
    if (decoded.isDemo && decoded.userId === 'demo1') {
      const updatedUser = {
        ...demoUser,
        ...body,
        _id: 'demo1', // Don't allow changing ID
        email: decoded.email, // Don't allow changing email for demo
        isDemo: true
      };
      
      console.log('✅ Demo user updated');
      return Response.json({ 
        success: true, 
        data: updatedUser 
      });
    }
    
    // For real users, you would update in database
    return Response.json({ 
      success: false, 
      error: 'User not found' 
    }, { status: 404 });
    
  } catch (error) {
    console.error('❌ Update error:', error);
    return Response.json({ 
      success: false, 
      error: 'Invalid token or update failed' 
    }, { status: 401 });
  }
}