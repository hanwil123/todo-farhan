import supabase  from '../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a lead user
    const email = 'lead@example.com';
    const password = 'password123'; // In a real app, use a secure password
    
    // Check if lead user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return NextResponse.json({ success: true, message: 'Lead user already exists' });
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      // Add user to users table with lead role
      const { error: dbError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        role: 'lead',
        created_at: new Date().toISOString(),
      });
      
      if (dbError) throw dbError;
      
      return NextResponse.json({ 
        success: true, 
        message: 'Lead user created successfully',
        user: {
          email,
          password // Only for demo purposes
        }
      });
    }
    
    return NextResponse.json({ success: false, message: 'Failed to create lead user' }, { status: 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

