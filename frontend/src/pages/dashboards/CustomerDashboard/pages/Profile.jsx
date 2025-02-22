import React, { useState } from 'react';
import { toast } from "sonner";
import { User, Mail, Phone, Edit, Star, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 234 567 8900',
    profileImage: '/api/placeholder/400/400',
    bio: 'Comedy enthusiast and regular show-goer'
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      type: 'venue',
      name: 'The Comedy Cellar',
      rating: 4.5,
      comment: 'Great atmosphere and talented performers!',
      date: '2024-02-15'
    },
    {
      id: 2,
      type: 'event',
      name: 'Stand-up Night with John Doe',
      rating: 5,
      comment: 'Absolutely hilarious show!',
      date: '2024-02-10'
    }
  ]);

  const [followingArtists, setFollowingArtists] = useState([
    {
      id: 1,
      name: 'John Doe',
      image: '/api/placeholder/100/100',
      upcomingShows: 3
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: '/api/placeholder/100/100',
      upcomingShows: 2
    }
  ]);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(userData.profileImage);

  const handleProfileUpdate = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
    toast.success('Profile Updated Successfully');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUserData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={userData.profileImage} 
                  alt={userData.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{userData.name}</h1>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{userData.bio}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Your Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-card rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground">{review.name}</h3>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    ★ {review.rating}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Following Artists */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Following Artists</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {followingArtists.map(artist => (
              <div key={artist.id} className="bg-card rounded-lg p-4 flex items-center gap-4">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{artist.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>{artist.upcomingShows} upcoming shows</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default Profile;
