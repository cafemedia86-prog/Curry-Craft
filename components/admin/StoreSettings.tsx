import React, { useState, useEffect, useRef } from 'react';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { MapPin, Save, Loader2, Globe, Phone, Mail, Instagram, Facebook, Twitter, Info, Search, Target } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const StoreSettings: React.FC = () => {
    const { settings, loading, updateSettings } = useStoreSettings();
    const [formData, setFormData] = useState({
        outlet_name: '',
        outlet_latitude: 28.5114747,
        outlet_longitude: 77.0740924,
        address: '',
        phone: '',
        email: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        about_text: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [mapSearch, setMapSearch] = useState('');
    const [isSearchingMap, setIsSearchingMap] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                outlet_name: settings.outlet_name || '',
                outlet_latitude: settings.outlet_latitude,
                outlet_longitude: settings.outlet_longitude,
                address: settings.address || '',
                phone: settings.phone || '',
                email: settings.email || '',
                facebook_url: settings.facebook_url || '',
                instagram_url: settings.instagram_url || '',
                twitter_url: settings.twitter_url || '',
                about_text: settings.about_text || ''
            });
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        const result = await updateSettings(formData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Store settings updated successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        }
        setIsSaving(false);
    };

    const handleAddressSearch = async () => {
        if (!mapSearch.trim()) return;
        setIsSearchingMap(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setFormData(prev => ({
                    ...prev,
                    outlet_latitude: parseFloat(lat),
                    outlet_longitude: parseFloat(lon)
                }));
            } else {
                alert("Location not found. Please try a more specific address.");
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearchingMap(false);
        }
    };

    // Component to handle map clicks and centering
    function MapController() {
        const map = useMap();

        // Fix for "map not fully loading" - invalidates size on mount and coordinate changes
        useEffect(() => {
            const timer = setTimeout(() => {
                map.invalidateSize();
                map.setView([formData.outlet_latitude, formData.outlet_longitude], map.getZoom());
            }, 100);
            return () => clearTimeout(timer);
        }, [map, formData.outlet_latitude, formData.outlet_longitude]);

        useMapEvents({
            click(e) {
                setFormData(prev => ({
                    ...prev,
                    outlet_latitude: e.latlng.lat,
                    outlet_longitude: e.latlng.lng
                }));
            },
        });
        return <Marker position={[formData.outlet_latitude, formData.outlet_longitude]} />;
    }

    if (loading) return <div className="text-white p-6">Loading settings...</div>;

    const inputClasses = "w-full bg-green-900/20 text-white p-3 rounded-xl border border-green-800/30 focus:border-amber-500/50 outline-none transition-all text-sm";
    const labelClasses = "text-[10px] font-bold text-green-400/60 uppercase tracking-widest mb-1.5 block px-1";

    return (
        <div className="p-6 animate-in fade-in duration-500 pb-20">
            <header className="mb-8">
                <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                    <Globe className="text-amber-500" /> Store Profile & Location
                </h2>
                <p className="text-green-400/50">Manage your brand info and set your delivery base point.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact & Brand Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#034435] p-8 rounded-[2.5rem] border border-green-800/30 shadow-xl">
                        <h3 className="text-xl text-white font-serif mb-6 flex items-center gap-2">
                            <Phone size={20} className="text-amber-500" /> Brand Identity
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className={labelClasses}>Outlet Name</label>
                                <input
                                    type="text"
                                    value={formData.outlet_name}
                                    onChange={(e) => setFormData({ ...formData, outlet_name: e.target.value })}
                                    className={inputClasses}
                                    placeholder="DDH Curry Craft Main"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Primary Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={inputClasses}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Official Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClasses}
                                    placeholder="royal@currycraft.in"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Public Address (Footer)</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className={inputClasses}
                                    placeholder="Luxury Heights, Sector 12..."
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className={labelClasses}>About Story (Intro)</label>
                            <textarea
                                value={formData.about_text}
                                onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                                className={`${inputClasses} h-24 resize-none`}
                                placeholder="Describe your royal essence..."
                            />
                        </div>

                        <h3 className="text-xl text-white font-serif mb-6 flex items-center gap-2 pt-4 border-t border-green-800/30">
                            <Instagram size={20} className="text-amber-500" /> Social Networks
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>Instagram</label>
                                <div className="relative">
                                    <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/40" />
                                    <input
                                        type="text"
                                        value={formData.instagram_url}
                                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="URL"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Facebook</label>
                                <div className="relative">
                                    <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/40" />
                                    <input
                                        type="text"
                                        value={formData.facebook_url}
                                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="URL"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Twitter</label>
                                <div className="relative">
                                    <Twitter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/40" />
                                    <input
                                        type="text"
                                        value={formData.twitter_url}
                                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="URL"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map & Coordinates */}
                <div className="space-y-6">
                    <div className="bg-[#034435] p-6 rounded-[2.5rem] border border-green-800/30 shadow-xl flex flex-col h-full">
                        <h3 className="text-lg text-white font-serif mb-4 flex items-center gap-2">
                            <Target size={18} className="text-amber-500" /> Location HQ
                        </h3>

                        {/* Search Bar for Map */}
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/40" />
                                <input
                                    type="text"
                                    value={mapSearch}
                                    onChange={(e) => setMapSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                                    className="w-full bg-green-950/40 text-white pl-9 pr-3 py-2 rounded-xl border border-green-800/30 text-xs focus:ring-1 focus:ring-amber-500/30 outline-none"
                                    placeholder="Search place or address..."
                                />
                            </div>
                            <button
                                onClick={handleAddressSearch}
                                className="p-2 bg-green-800 hover:bg-amber-600 rounded-xl text-white transition-colors"
                            >
                                {isSearchingMap ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            </button>
                        </div>

                        <div className="flex-1 min-h-[250px] rounded-2xl overflow-hidden mb-6 relative z-0 border border-green-800/50">
                            <MapContainer
                                center={[formData.outlet_latitude, formData.outlet_longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap'
                                />
                                <MapController />
                            </MapContainer>
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white z-[1000]">
                                Click map to reposition
                            </div>
                        </div>

                        {/* Coordinates Display (Restored) */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className={labelClasses}>Latitude</label>
                                <input
                                    type="number"
                                    value={formData.outlet_latitude}
                                    onChange={(e) => setFormData({ ...formData, outlet_latitude: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-green-950/40 text-white p-2.5 rounded-xl border border-green-800/30 text-xs font-mono"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Longitude</label>
                                <input
                                    type="number"
                                    value={formData.outlet_longitude}
                                    onChange={(e) => setFormData({ ...formData, outlet_longitude: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-green-950/40 text-white p-2.5 rounded-xl border border-green-800/30 text-xs font-mono"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-900/20 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            Save All Settings
                        </button>

                        {message && (
                            <div className={`mt-4 p-4 rounded-xl text-xs font-bold text-center animate-in zoom-in-95 duration-200 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {message.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-green-900/20 p-6 rounded-[2rem] border border-green-800/30 flex items-start gap-4">
                <Info className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-green-100/40 text-xs leading-relaxed">
                    <strong>Search Tip:</strong> Use the search bar above the map to find your area quickly. You can then fine-tune the marker position by clicking on the map. The Coordinates (Lat/Long) are automatically updated but can be edited manually if you have specific data.
                </p>
            </div>
        </div>
    );
};

export default StoreSettings;
